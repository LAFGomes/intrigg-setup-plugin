import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { IframeMessageProxy } from 'iframe-message-proxy';
import IMPContainer from '../constants/iframe-message-proxy-container';

const commandsUrl = 'https://msging.net/commands';

const getApplicationDataAsync = async (fullIdentity = null) => {
    const { response: application } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.GET_APPLICATION,
        content: fullIdentity
    });
    return application;
};

const getApplication = async () => {
    try {
        const { response: application } = await IframeMessageProxy.sendMessage({
            action: 'getApplication'
        });

        return application;
    } catch (err) {
        console.log(err);
        return "Unable to get application data";
    }
};

const getCurrentLanguageAsync = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.GET_CURRENT_LANGUAGE
    });

    return response;
};

const getInmoConfigFile = async () => {
    try {
        const res = await IframeMessageProxy.sendMessage({
            action: 'sendCommand',
            content: {
                destination: 'MessagingHubService',
                command: {
                    to: 'postmaster@msging.net',
                    method: 'get',
                    uri: '/buckets/config-properties'
                }
            }
        });

        return res.response;

    } catch (err) {
        console.log(err);
        return "unable to get inmo config file";
    }
};

const getBuilderStates = async (service) => {
    try {

        const decodedAccessKey = Buffer.from(service.accessKey,'base64').toString();
        const botId = service.identity;
        const authKey = `key ${(Buffer.from(`${botId}:${decodedAccessKey}`).toString('base64'))}`;

        const body = {
            id: uuidv4(),
            method: 'get',
            uri: '/buckets/blip_portal:builder_published_flow'
        };
        console.log(body);
        const builderPublishedFlow = await axios.post(commandsUrl, body, {
            headers: {
                Authorization: authKey,
                'Content-Type' : 'application/json'
            }
        });
        const flowBlocksData = Object.values(builderPublishedFlow.data.resource);
        console.log(flowBlocksData);
        const filteredBlocksData = [];
        flowBlocksData.forEach((block) => {
            const data = {
                blockId: block.id,
                blockTitle: block.$title
            };
            filteredBlocksData.push(data);            
        });

        return filteredBlocksData;

    } catch (err) {
        console.log(err);
        return "unable to get builder states";
    }
};

// const getTemplates = async () => {
//     try {
//         const res = await IframeMessageProxy.sendMessage({
//             action: 'sendCommand',
//             content: {
//                 destination: 'MessagingHubService',
//                 command: {
//                     to: 'postmaster@wa.gw.msging.net',
//                     method: 'get',
//                     uri: '/message-templates?status=APPROVED'
//                 }
//             }
//         });

//         return res.response.data;

//     } catch (err) {
//         console.log(err);
//         return "unable to get templates";
//     }
// };

const getTemplates = async () => {
    const templates = [];
    templates.exemplo01 = {
        templateId: '0000000000',
        name: 'exemplo01',
        text: 'Conteudo do template',
        templateVariables: ['variável 1']
    };
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
    
    res.response.data.forEach((data) => {
        let variablesArray = [];
        let content = '';
        data.components.forEach((component) => {
            if (component.type === 'BODY') {
                content = component.text;
                const templateVariablesCount = content.match(/{{\d}}/gi);
                if (templateVariablesCount){
                    variablesArray = templateVariablesCount;
                }
            }
        });

        templates[data.name] = {
            id: data.id,
            name: data.name,
            text : content,
            templateVariables : variablesArray
        };
    });
    
    console.log(templates);
    return templates;
};

const getAllAllowedServicesParameters = async (application) => {
    console.log(application);
    try {
        const promises = [];
        const filteredServicesParameters = [];
        const services = application.applicationJson.settings.children.map(
            (bot) => bot.identity
        );

        if (!!services) {
            services.forEach((botId) => {
                promises.push(getApplicationDataAsync(botId));
            });
            const fulfilledPromises = (await Promise.allSettled(promises)).filter((promise) => promise.status === 'fulfilled');
            const servicesParameters = fulfilledPromises.map((promise) => promise.value);
            servicesParameters.forEach((service) => {
                const parameters = {
                    identity: service.applicationJson.identifier,
                    accessKey: service.applicationJson.accessKey,
                    name: service.name,
                    flowid: (!!service.applicationJson.settings.flow.id) ? service.applicationJson.settings.flow.id : ''
                };
                filteredServicesParameters.push(parameters);
            });
            console.log(filteredServicesParameters);
            return filteredServicesParameters;
        }
        return null;
    } catch (err) {
        console.log(err);
        return "Unable to get all sub bots configurations";
    }
};

export {
    getApplication,
    getApplicationDataAsync,
    getAllAllowedServicesParameters,
    getBuilderStates,
    getCurrentLanguageAsync,
    getTemplates,
    getInmoConfigFile
};




