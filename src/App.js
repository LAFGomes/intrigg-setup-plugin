import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import Routes from './routes';
import Triggers from './pages/Home/components/Triggers';

import i18n from './translate';

import {
    getApplication,
    getAllAllowedServicesParameters,
    // getBuilderStates,
    getCurrentLanguageAsync,
    getTemplates
} from './services/application-service';
import * as bucket from './services/bucket-service';
import { withLoadingAsync, showToast } from './services/common-service';
import BlipPortalToastTypes from './constants/blip-portal-toast-types';

const DEFAULT_LANGUAGE = 'pt';

const App = () => {
    const { t } = useTranslation();
    const [application, setApplication] = useState({});
    const [allowedServicesParameters, setAllowedServicesParameters] = useState([]);
    const [namespace, setNamespace] = useState();
    const [configData, setConfigData] = useState();
    const [triggers, setTriggers] = useState();
    // const [configFile, setConfigFile] = useState([]);
    // const [builderStates, setBuilderStates] = useState([]);
    const [templates, setTemplates] = useState([]);    

    useEffect(() => {
        getInitialInfoAsync();
        // eslint-disable-next-line
	}, []);

    const getInitialInfoAsync = async () => {
        await withLoadingAsync(async () => {
            const clientConfigFile = await bucket.getInmoConfigFile();
            setNamespace(clientConfigFile.namespace);
            setConfigData(clientConfigFile.triggers);
            const triggersId = Object.keys(clientConfigFile.triggers);
            setTriggers(triggersId);
            const applicationData = await getApplication();
            const parameters = await getAllAllowedServicesParameters(applicationData);
            setApplication(applicationData);
            setAllowedServicesParameters(parameters);
            // setBuilderStates(await getBuilderStates(parameters));  will not be used now. But when user select subbot
            setTemplates(await getTemplates());
            await getLanguageAsync();
            console.log(templates);
            console.log(clientConfigFile);
            showToast({
                type: BlipPortalToastTypes.SUCCESS,
                message: t('success.loaded')
            });
        });
        
        console.log(namespace);
        console.log(configData);
        console.log(triggers);


        console.log(application);
        console.log(allowedServicesParameters);
        console.log(templates);
    };

    const getLanguageAsync = async () => {
        const language = await getCurrentLanguageAsync();

        if (!!language && language !== DEFAULT_LANGUAGE) {
            i18n.changeLanguage(language);
        }
    };

    if (!namespace || !configData || !triggers || !templates) {
        return (<p>NOT FOUND</p>);
    }

    return <Triggers
        namespace={namespace}
        configData={configData}
        triggersId={triggers}
        templates={templates}
    />;

    // return <Routes 
    //     servicesParameters={allowedServicesParameters}
    //     templates={templates}
    // />;
};

export default App;
