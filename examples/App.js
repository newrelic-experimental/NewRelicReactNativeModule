/**
 * Requires React Navigation v4 (https://reactnavigation.org/docs/4.x/getting-started):
 * `npm install react-navigation`
 * `npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view`
 * `npm install react-navigation-stack @react-native-community/masked-view react-native-safe-area-context`
 * `cd ios; pod install; cd ..`
 */

import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';
import {Text, View, Button, ActivityIndicator, FlatList} from 'react-native';

// Include this line below to access the New Relic Function
import {
	nrInit,
	nrLog,
	nrError,
	nrWarning,
	nrCritical,
	nrInteraction,
	nrAddUserId,
	nrRecordMetric,
} from './NewRelicRN.js';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null,
		};
	}

	componentDidCatch(error, errorInfo) {
		// Catch errors in any child components and re-renders with an error message
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
		// New Relic can be added to the ErrorBoundary
		nrLog(error);
	}

	render() {
		if (this.state.error) {
			// Fallback UI if an error occurs
			return (
				<div>
					<h2>{'Oh-no! Something went wrong'}</h2>
					<p className="red">
						{this.state.error && this.state.error.toString()}
					</p>
					<div>{'Component Stack Error Details: '}</div>
					<p className="red">{this.state.errorInfo.componentStack}</p>
				</div>
			);
		}
		// component normally just renders children
		return this.props.children;
	}
}

class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Welcome',
	};

	render() {
		// New Relic can add an interaction line to see what screens are dislayed
		nrInteraction('Welcome');

		// Create Custom event tables in New Relic Insights
		var sampledata = {
			cityName: 'Philadelphia',
			zipCode: 19134,
			username: 'bob',
			alive: true,
		};
		nrRecordMetric('mycustom', sampledata);

		const {navigate} = this.props.navigation;

		return (
			<Button
				title="Go to Good HTTP/s Call Interaction"
				onPress={() => navigate('Gdata', {name: 'Jane'})}
			/>
		);
	}
}

class DataScreen extends React.Component {
	static navigationOptions = {
		title: 'Results',
	};

	constructor(props) {
		super(props);
		this.state = {isLoading: true};
	}

	componentDidMount() {
		return fetch('https://facebook.github.io/react-native/movies.json')
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				this.setState(
					{
						isLoading: false,
						dataSource: responseJson.movies,
					},
					function () {},
				);
			})
			.catch((error) => {
				// logging function can be added here as well
				console.error(error);
				nrError(error);
			});
	}

	render() {
		// New Relic can add the user to collect what sessions are related to the user
		nrAddUserId('bob');

		// New Relic can add an interaction line to see what screens are dislayed
		nrInteraction('Results');

		if (this.state.isLoading) {
			return (
				<View style={{flex: 1, padding: 20}}>
					<ActivityIndicator />
				</View>
			);
		}

		const {navigate} = this.props.navigation;

		return (
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<Text>Data Screen</Text>
				<Button onPress={() => navigate('Bdata')} title="Bad HTTP error" />
				<Button onPress={() => navigate('Home')} title="HOME" />
				<Button onPress={() => console.log(this.state)} title="Error" />

				<FlatList
					data={this.state.dataSource}
					renderItem={({item}) => (
						<Text>
							{item.title}, {item.releaseYear}
						</Text>
					)}
					keyExtractor={({id}, index) => id}
				/>
			</View>
		);
	}
}

class BadDataScreen extends React.Component {
	static navigationOptions = {
		title: 'Dataset',
	};

	constructor(props) {
		super(props);
		this.state = {isLoading: true};
	}

	componentDidMount() {
		return fetch('https://facebook.github.io/react-native/moviessssssssss.json')
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				this.setState(
					{
						isLoading: false,
						dataSource: responseJson.movies,
					},
					function () {},
				);
			})
			.catch((error) => {
				console.error(error);
				// logging function can be added here as well
				nrCritical(error);
			});
	}

	render() {
		nrInteraction('Dataset');
		if (this.state.isLoading) {
			return (
				<View style={{flex: 1, padding: 20}}>
					<ActivityIndicator />
				</View>
			);
		}

		const {navigate} = this.props.navigation;

		return (
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<Text>Data Screen</Text>
				<Button onPress={() => navigate('Bdata')} title="Bad HTTP error" />
				<FlatList
					data={this.state.dataSource}
					renderItem={({item}) => (
						<Text>
							{item.title}, {item.releaseYear}
						</Text>
					)}
					keyExtractor={({id}, index) => id}
				/>
			</View>
		);
	}
}

const MainNavigator = createStackNavigator({
	Home: {screen: HomeScreen},
	Gdata: {screen: DataScreen},
	Bdata: {screen: BadDataScreen},
});

const App = createAppContainer(MainNavigator);

nrInit('Home');

export default App;
