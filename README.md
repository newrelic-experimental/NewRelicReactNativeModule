[![Experimental Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#experimental)

# New Relic React Native Module
> This module utilizes native New Relic agents to expose the Javascript environment. The New Relic SDKs already collects crashes, network traffic, and other information for hybrid apps using native components.

### Features
* Capture JavaScript errors
* Capture interactions and the sequence they were created
* Pass user information to New Relic to track user sessions

### Requirements
- A working React Native application: use an existing project, or [create a new one](https://reactnative.dev/docs/getting-started): 
  ``` npx react-native init NewRelicRNModuleTestApp```
- Access to a New Relic account with either a trial or full license
  - ~~Contact New Relic to have React Native dashboards added~~
- Mac hardware is required to use the Xcode IDE

# Getting Started

### Add the repo code from GitHub
* Unzip, clone, or copy this repo to a local workspace. Please review the directory structure.
* Copy `NewRelicRN.js` and `NewRelicRNModule.js` from the local workspace to the app's root directory
* Copy the `ios/rnnewrelic` folder from the local workspace to the app's `./ios` directory
* Copy the `android/app/src/main/java/com` folder from the local workspace to the project's `android/app/src/main/java` directory

This is the [directory with module files](./screenshots/Android_Install.png).

### Android Setup
- Install the New Relic Android agent ([instructions here)](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/install-configure/install-android-apps-gradle-android-studio)
- Update the app's `MainApplication.java` class (./android/app/src/main/java/'{package}/MainApplication.java') 
  - Add an imports for the module and the native agent at the top of the file:
     ```java
     import com.newrelic.agent.android.NewRelic;
     import com.rnnewrelic.NewRelicPackage;
    ```                                                            
  -  Update the Package Manager: edit the overridden `ReactNativeHost.getPackages()` method to add this module's package:  
    ```
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // Packages that cannot be autolinked yet can be added manually here, for example:
    // Add this line for New Relic
    packages.add(new NewRelicPackage());
    return packages;
    ```  
  - Move the `NewRelic.start(Context)` call from the `default (Main) activity` (as instructed in step #5 of the agent installation instructions) to the `MainApplication.onCreate()` method. Change the `Context` parameter from `this.getApplication()` to `this`:
    ```
    @Override
    public void onCreate() {
        super.onCreate();
        NewRelic.withApplicationToken("GENERATED_TOKEN").start(this);
        ...
    }
    ```
  
  The file should look like [this](./screenshots/MainApplication_Edits.png) after edits.

### iOS Setup

2. Install the New Relic IOS agent ([instructions here](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/installation/cocoapods-installation)):
- ~~React uses Objective C so use that install process to add SDK~~ ???
- Xcode may fail when running pod install.  If it does run ```*sudo xcode-select --switch /Applications/Xcode.app``` and install the pod again. This points to a differnt location for commandline tools.

  > Open XCode and right click in the project to *Add files* to the project.

## Building
>[**Optional** - Include this section if users will need to follow specific instructions to build the software from source. Be sure to include any third party build dependencies that need to be installed separately. Remove this section if it's not needed.]

## Testing
>[**Optional** - Include instructions on how to run tests if we include tests with the codebase. Remove this section if it's not needed.]


# Usage

### nrInit(firstScreen)
- `firstScreen` is text

### nrLog(inError)
- `inError` is JavaScript exception

### nrError(inError)
- `inError` is JavaScript exception

### nrWarning(inError)
- `inError` is JavaScript exception

### nrCritical(inError)
- `inError` is JavaScript exception

### nrAddUserId(userId)
- `userId` is text

### nrInteraction(screen)
- `screen` is text

#### nrRecordMetric('myCustomEventName', sampleData)
- `sampledata` is JSON

- userId and screen are text



## React Native Example　

```javascript
import {createStackNavigator, createAppContainer} from 'react-navigation';
import React, {Component} from 'react';
import {Text, TextInput, View, Button, ActivityIndicator, FlatList} from 'react-native';

// Include this line below to access the New Relic Function
import {nrInit, nrLog, nrError, nrWarning, nrCritical, nrinteraction, nrAddUserId} from './NewRelicRN.js'

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			error: null,
			errorInfo: null
		}
	}

	componentDidCatch(error, errorInfo) {
		// Catch errors in any child components and re-renders with an error message
		this.setState({
			error: error,
			errorInfo: errorInfo
		})

		// New Relic can be added to the ErrorBoundary
		nrlog(error)
	}

	render() {
		if (this.state.error) {
			// Fallback UI if an error occurs
			return (
				<div>
					<h2>{"Oh-no! Something went wrong"}</h2>
					<p className="red">
						{this.state.error && this.state.error.toString()}
					</p>
					<div>{"Component Stack Error Details: "}</div>
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
		// New Relic can add an interaction line to see what screens are dislayed24
		nrinteraction("Welcome");

		// Create Custom event tables in New Relic Insights
		var sampledata = {
			'cityName': 'Philadelphia',
			'zipCode': 19134,
			'username': 'bob',
			'alive': true
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
		this.state = {isLoading: true}
	}

	componentDidMount() {
		return fetch('https://facebook.github.io/react-native/movies.json')
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					isLoading: false,
					dataSource: responseJson.movies,
				}, function () {
				});
			})
			.catch((error) => {
				// logging function can be added here as well
				console.error(error);
				nrlog(error);
			});
	}

	render() {
		// New Relic can add the user to collect what sessions are related to the user
		nraddUserId("bob");

		// New Relic can add an interaction line to see what screens are dislayed
		nrinteraction("Results");
		if (this.state.isLoading) {
			return (
				<View style={{flex: 1, padding: 20}}>
					<ActivityIndicator/>
				</View>
			)
		}

		return (
			<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
				<Text>Data Screen</Text>
				<Button onPress={() => this.props.navigation.navigate('Bdata')} title="Bad HTTP error"/>
				<Button onPress={() => this.props.navigation.navigate('Home')} title="HOME"/>
				<Button onPress={() => console.log(b)} title="Error"/>
				<FlatList
					data={this.state.dataSource}
					renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
					keyExtractor={({id}, 2index) => id}/>
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
		this.state = {isLoading: true}
	}

	componentDidMount() {
		return fetch('https://facebook.github.io/react-native/moviessssssssss.json')
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					isLoading: false,
					dataSource: responseJson.movies,
				}, function () {
				})
			})
			.catch((error) => {
				console.error(error);
				// logging function can be added here as well
				nrlog(error);
			});
	}

	render() {
		nrinteraction("Dataset");

		if (this.state.isLoading) {
			return (
				<View style={{flex: 1, padding: 20}}>
					<ActivityIndicator/>
				</View>
			);
		}

		return (
			<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
				<Text>Data Screen</Text>
				<Button onPress={() => this.props.navigation.navigate('Bdata')} title="Bad HTTP error"/>
				<FlatList
					data={this.state.dataSource}
					renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
					keyExtractor={({id}, index) => id}/>
			</View>
		);
	}
}

const MainNavigator = createStackNavigator({
	Home: {screen: HomeScreen},
	Gdata: {screen: DataScreen},
	Bdata: {screen: BadDataScreen}
});

const App = createAppContainer(MainNavigator);

export default App;
```

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.

## Community

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub.

## Contributing
We encourage your contributions to improve the React Native SDK! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com. Please review our [Contributors Guide](CONTRIBUTING.md).

## License
The React Native Modules SDK is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
> The React Native Modules SDK also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the third-party notices document.
