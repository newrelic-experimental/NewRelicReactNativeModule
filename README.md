[![Experimental Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#experimental)

# New Relic React Native Module
> This module utilizes native New Relic agents to expose the Javascript environment. The New Relic SDKs collect crashes, network traffic, and other information for hybrid apps using native components.

<p align="center">
  <a href="https://www.npmjs.org/package/react-native">
    <img src="https://badge.fury.io/js/react-native.svg" alt="React Native npm package version." />
  </a>
  <a href="https://github.com/newrelic/NewRelicReactNativeModule/#contributing">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

### Features
* Capture JavaScript errors
* Capture interactions and the sequence they were created
* Pass user information to New Relic to track user sessions

### Requirements
- React Native 0.60
- A working React Native application: use an existing project, or [create a new one](https://reactnative.dev/docs/getting-started): 
  
  ```npx react-native init NewRelicRNModuleTestApp```
- Access to a New Relic account with either a trial or full license
  - ~~Contact New Relic to have React Native dashboards added~~
- Mac hardware is required to use the Xcode IDE

# Getting Started

### Add the repo code from GitHub
* Unzip, clone, or copy this repo to a local workspace. Please review the directory structure
* Copy `NewRelicRN.js` and `NewRelicRNModule.js` from the local workspace to the app's root directory
* Copy the `ios/rnnewrelic` folder from the local workspace to the app's `./ios` directory
* Copy the `android/app/src/main/java/com` folder from the local workspace to the project's `android/app/src/main/java` directory

Screenshots of the project with [Android](./screenshots/Android_Install.png) and [iOS](./screenshots/iOS_Install.png) module files added are [here](./screenshots).

### Android Setup
- Install the New Relic native Android agent ([instructions here](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/install-configure/install-android-apps-gradle-android-studio))
- Update the app's `MainApplication.java` file (./android/app/src/main/java/'{package}/MainApplication.java') 
  - Add an imports for the module and the native agent at the top of the file:
     ```java
     import com.newrelic.agent.android.NewRelic;
     import com.rnnewrelic.NewRelicPackage;
    ```                                                            
  -  Update the Package Manager: edit the overridden `ReactNativeHost.getPackages()` method to add this module's package:  
    ```java
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // Packages that cannot be autolinked yet can be added manually here, for example:
    // Add this line for New Relic
    packages.add(new NewRelicPackage());
    return packages;
    ```  
  - Move the `NewRelic.start(Context)` call from the `default (Main) activity` (as detailed in step #5 of the [agent installation instructions](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/install-configure/install-android-apps-gradle-android-studio)) to the `MainApplication.onCreate()` method. 
    - Change the `Context` parameter from `this.getApplication()` to `this`
    - Ensure`GENERATED_TOKEN` has been replaced with a valid New Relic application token
    ```java
    @Override
    public void onCreate() {
        super.onCreate();
        NewRelic.withApplicationToken("GENERATED_TOKEN").start(this);
        ...
    }
    ```
  
    `MainApplication.java` [should look like this](./screenshots/MainApplication_Edits.png) after edits.

### iOS Setup

- Install the New Relic native IOS agent ([instructions here](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/installation/cocoapods-installation) with [notes regarding agent v7.+](https://docs.newrelic.com/docs/release-notes/mobile-release-notes/xcframework-release-notes/xcframework-agent-700)):
  - Follow instructions to `Configure using Objective-C`
  - Xcode may fail when running `pod install`. If it does, run ```sudo xcode-select --switch /Applications/Xcode.app```, then ```pod install``` again.

- From XCode, right-click the app project drop down in the workspace 
  - select `Add files to ...`
  - add the `./rnnewrelic` folder copied from the local workspace
  
- Update the app's `AppDelegate.m` file: 
  - Ensure`APP_TOKEN` has been replaced with a valid New Relic application token when starting the agent
  
### Javascript setup
- Integrate [API calls](#usage) into the app's `App.js` file. Refer to [this example](./examples/App.js), or the [example provided below](#react-native-example).


## Building
Follow the [guidance from React Native](https://reactnative.dev/docs/running-on-device) to build and deploy your app to an emulator, simulator or device.

From the app's root directory, run:
* `npm start`, then
* `npx react-native run-ios` or
* `npx react-native run-android`

# Usage
The SDK provides a set of exported Javascript methods used to record app data. Use the [example app](#react-native-example) as a guide to use these API methods in your app:   

### nrInit(firstScreen)
> Call this to initialize the SDK. Pass a name of the app's landing screen as an argument. 
- `firstScreen` is text

### nrLog(inError)
> Call this to record a custom error event. 
- `inError` is JavaScript exception

### nrError(inError)
> Call this to record a custom error event at `error` level. 
- `inError` is JavaScript exception

### nrWarning(inError)
> Call this to record a custom error event at `warning` level. 
- `inError` is JavaScript exception

### nrCritical(inError)
> Call this to record a custom error event at `critical` level. 
- `inError` is JavaScript exception

### nrAddUserId(userId)
> Call this to associate a user with custom events. 
- `userId` is text

### nrInteraction(screen)
> Call this to record an interaction event. 
- `screen` is text 

#### nrRecordMetric('myCustomEventName', sampleData)
> Call this to record a custom metric. 
- `sampledata` is JSON


## React Native Example　

```javascript
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
