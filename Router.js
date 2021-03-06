/**
 * Created by zhangfan on 17-4-11.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    BackAndroid,
    Platform
} from 'react-native';


class Router extends Component {

    render() {
        return <Navigator style={{flex: 1, alignSelf: "stretch"}}
                          ref="navigator"
                          initialRoute={{
                              component: this.props.scenes.index.props.component
                          }}
                          renderScene={(route, navigator) => {
                              let Comp = route.component;
                              return <WrapperComponent onAndroidBack={this.onAndroidBack}
                                                       ref={(it) => route.container = it}
                              >
                                  <Comp {...route.params} ref={(it) => route.ref = it}/>
                              </WrapperComponent>
                          }}

        />
    }

    onAndroidBack = () => {
        let routes = this.refs.navigator.getCurrentRoutes();
        if (routes && routes.length > 1) {
            this.refs.navigator.pop();
            return true
        }
        return false
    };

    componentDidMount() {
        this.props.scenes.act = (scene, params) => {
            this.refs.navigator.push({
                component: scene.props.component,
                params: params
            })
        };
        this.props.scenes.pop = () => {
            this.refs.navigator.pop();
        };
        this.props.scenes.hehe = () => {
            let routes = this.refs.navigator.getCurrentRoutes();
            console.info(routes[routes.length - 1].ref.hehe())
        };
        this.props.scenes.insertModule = (moduleView) => {
            let routes = this.refs.navigator.getCurrentRoutes();
            routes[routes.length - 1].container.insertModule(moduleView)
        }
    }
}

import ModuleRoot from './module/ModuleRoot'

class WrapperComponent extends Component {

    insertModule = (moduleView) => {
        this.refs.moduleRoot.insertModule(moduleView);
    };

    render() {
        return (
            <View style={{flex: 1, alignSelf: "stretch"}}>
                {this.props.children}
                <ModuleRoot ref="moduleRoot"/>
            </View>
        )
    }

    handlerCallBack = () => {
        return this.props.onAndroidBack();
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.handlerCallBack);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.handlerCallBack);
        }
    }
}

export default Router