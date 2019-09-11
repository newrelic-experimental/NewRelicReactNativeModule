![](https://docs.newrelic.com/sites/default/files/thumbnails/image/mobile%402x.png)
# New Relic React Native Modules SDK

This is a module that exposes the Javascript environment to New Relic.  It is important to note that the Native New Relic SDK already collects Crashes, HTTP traffic, and other information becasue React-Native already uses the respective native components. This Module is an add on to the New Relic Native SDKs.

### Assumptions
- There is a working React Native application to monitor or at least a React-Native project setup.
- A Mac is required for use the Xcode IDE

### Features

Capture JavaScript errors
Capture Interactions and the sequence they were created.
Pass user information to New Relic to track user sessions.

### Functions

nrlog(inError)
nrerror(inError)
nrwarning(inError)
nrcritical(inError)
nraddUserId(userId)
nrinteraction(screen)

### Installation

There are three major areas that need to be addressed as part of the installation.
1. Install the New Relic Native Android SDK: [Link to Doc](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/install-configure/install-android-apps-gradle-android-studio)
1a. Please merge the gradle files not replace.
2. Install the New Relic Native IOS SDK: [Link to Doc](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/installation/cocoapods-installation)
2a. Point to Note React uses Objective C so use that install process to add SDK
2b. Xcode may fail when running pod install.  If it does use *sudo xcode-select --switch /Applications/Xcode.app hen install pod again* then install pod again. This points to a differnt location for commandline tools.
3. Add the code from the github.
3a. Unzip, clone, or copy the files from the root of the project.  The directory structure is there and will copy the files into the correct place.



####Javascript　

```javascript
import {createStackNavigator, createAppContainer} from 'react-navigation';
import React, { Component } from 'react';
import { Text, TextInput,View, Button,ActivityIndicator,FlatList } from 'react-native';
// Include this line below to access the New Relic Function
import {nrlog,nrerror,nrwarning,nrcritical,addUserId,nrInit,nrinteraction,nraddUserId} from './NewRelicRN.js'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
	// New Relic can be added to the ErrorBoundary
    nrlog(error);
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
  // New Relic can add an interaction line to see what screens are dislayed
    nrinteraction("Welcome");
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

  constructor(props){
        super(props);
        this.state ={ isLoading: true}
      }

      componentDidMount(){
      return fetch('https://facebook.github.io/react-native/movies.json')
        .then((response) => response.json())
        .then((responseJson) => {

          this.setState({
            isLoading: false,
            dataSource: responseJson.movies,
          }, function(){

          });

        })
        .catch((error) =>{
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
      if(this.state.isLoading){
        return(
          <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator/>
          </View>
        )
      }

      return (

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Data Screen</Text>
          <Button onPress={() => this.props.navigation.navigate('Bdata')} title="Bad HTTP error"/>
          <Button onPress={() => this.props.navigation.navigate('Home')} title="HOME"/>
          <Button onPress={() => console.log(b)} title="Error"/>

          <FlatList
            data={this.state.dataSource}
            renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
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
      constructor(props){
        super(props);
        this.state ={ isLoading: true}
      }

      componentDidMount(){
      return fetch('https://facebook.github.io/react-native/moviessssssssss.json')
        .then((response) => response.json())
        .then((responseJson) => {

          this.setState({
            isLoading: false,
            dataSource: responseJson.movies,
          }, function(){

          });

        })
        .catch((error) =>{
          console.error(error);
		  // logging function can be added here as well
          nrlog(error);
        });
    }

    render() {
      nrinteraction("Dataset");
      if(this.state.isLoading){
        return(
          <View style={{flex: 1, padding: 20}}>

            <ActivityIndicator/>
          </View>
        )
      }

      return (

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Data Screen</Text>
          <Button onPress={() => this.props.navigation.navigate('Bdata')} title="Bad HTTP error"/>
          <FlatList
            data={this.state.dataSource}
            renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
            keyExtractor={({id}, index) => id}
          />
        </View>
      );
    }
}



const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Gdata: {screen:DataScreen},
  Bdata: {screen:BadDataScreen}
});

const App = createAppContainer(MainNavigator);

export default App;

```
