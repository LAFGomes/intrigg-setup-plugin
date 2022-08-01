import { IframeMessageProxy } from 'iframe-message-proxy';
import IMPContainer from '../constants/iframe-message-proxy-container';

const getApplicationDataAsync = async (fullIdentity = null) => {
    const { response: application } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.GET_APPLICATION,
        content: fullIdentity
    });
    return application;
};

const getCurrentLanguageAsync = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.GET_CURRENT_LANGUAGE
    });

    return response;
};


const getBuilderStates = async () => {
    const res = await IframeMessageProxy.sendMessage({
        action: 'sendCommand',
        content: {
            destination: 'MessagingHubService',
            command: {
                to: 'postmaster@msging.net',
                method: 'get',
                uri: '/buckets/blip_portal:builder_published_flow'
            }
        }
    });
    const builderStates = [];
    const objectEntries = Object.entries(res.response);
    for (let i = 0; i < objectEntries.length; i++) {
        let states = {
            'id': (objectEntries[i])[1].id,
            'stateName': (objectEntries[i])[1].$title
        }
        builderStates.push(states);
    }

    return builderStates;
};

const getTemplates = async () => {
    const templates = [];
    const res = await IframeMessageProxy.sendMessage({
        action: 'sendCommand',
        content: {
            destination: 'MessagingHubService',
            command: {
                to: 'postmaster@wa.gw.msging.net',
                method: 'get',
                uri: '/message-templates?status=APPROVED'
            }
        }
    });
    res.response.data.ForEach((data) => {
        let content = '';
        data.components.ForEach((component) => {
            if (component.type === 'BODY') {
                content = component.text;
            }
        });

        const template = {
            id : data.id,
            name: data.name,
            text : content
        };
        templates.push(template);
    });
    
    console.log(templates);
    return templates;
};

const getAllAllowedServicesParameters = async (bot) => {
    let subbots = [];
    for (let i = 0 ; i < bot.children.length ; i++){
        const { response } = await IframeMessageProxy.sendMessage({
            action: 'sendCommand',
            content: {
                destination: 'BlipService',
                command: {
                    method: 'get',
                    to: 'postmaster@portal.blip.ai',
                    uri: `/applications/${bot.children[i].identity}`
                }
            }
        });
        const botData = {
            identity: bot.children[i].identity,
            longName: bot.children[i].longName,
            accessKey: response.accessKey
        }; 
        console.log(botData);
        console.log(subbots);
        subbots.push(botData);
    }

    return subbots;
};


export { getApplicationDataAsync, getAllAllowedServicesParameters, getBuilderStates, getCurrentLanguageAsync, getTemplates };
