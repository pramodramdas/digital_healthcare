import AppComponent from './App';
import React from 'react';
import { Switch, Route, Prompt } from 'react-router-dom';
import Login from "./components/login";
import Home from "./components/home";
import Header from "./components/header";
import { Layout } from 'antd';

const { Content } = Layout;

const IndexComponent = (props) => {
    return (
        <Layout className="layout">
            <Header {...props}/>
            <Content style={{ padding: '0 50px' }}>
                <AppComponent>  
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/home" component={Home} />
                    </Switch>
                </AppComponent>
            </Content>
            <Prompt when={true} message={(location) => {
                    if(location.pathname !== '/login')   
                        return  "message";
                }} 
            />
        </Layout>
    );
}

export default IndexComponent;