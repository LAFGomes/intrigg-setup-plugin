/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const defaultModalInfo = {
    templateId: '0000000000',
    name: 'exemplo01',
    text: 'Conteudo do template',
    templateVariables: ['variável 1']
};

const Triggers = ({ triggersId, namespace, configData, templates }) => {
    console.log(templates);
    const [configuredTriggers, setTriggers] = useState(triggersId);
    const [triggersData, setConfigData] = useState(configData);
    const [configuredNamespace, setNamespace] = useState(namespace);
    const [openModal, setOpenModal] = useState(false);
    const [numberOfDivs, setNumberOfDivs] = useState(0);
    const [modalInfo, setModalInfo] = useState([defaultModalInfo]);
    const [divArray, setDivArray] = useState([]);
    const [newTriggerModal, setNewTriggerModal] = useState(false);
    const [tst1, setTst1] = useState(defaultModalInfo);
    const cardsPerDivs = 4;
    const divNumb = Math.ceil(triggersId.length / cardsPerDivs);

    useEffect(() => {
        defineDivArray();
    }, []);

    // useEffect(() => {
    //     defineDivArray();
    // }, [configData, numberOfDivs]);

    // useEffect(() => {
    //     const divNumb = Math.ceil(triggers2.length / cardsPerDivs);
    //     setNumberOfDivs(divNumb);
    //     console.log(divNumb);
    // }, []);

    // useEffect(() => {
    //     window.location.reload();
    // }, [namespace]);

    const handleModalCreation = (trigger) => {
        console.log(trigger);
        if (!!trigger) {
            setModalInfo([trigger]);
            setNewTriggerModal(false);
        }
        else {
            console.log("deu boa");
            // const values = Object.values(configData);
            // console.log(values);
            setModalInfo([defaultModalInfo]);
            setNewTriggerModal(true);
        }
        setOpenModal(true);
    };

    const handleModalUpdate = (trigger) => {
        const newModalSetup = [{
            templateId : templates[trigger].name,
            templateVariables : templates[trigger].templateVariables
        }];

        setModalInfo(newModalSetup);
    };

    const defineDivArray = () => {
        try {
            const divs = [];
            for (let i = 0; i <= divNumb; i++) {
                const beginInterval = i * 4;
                const cardArray = [];
                const endInterval = beginInterval + 3;
                for (let index = beginInterval; index <= endInterval; index++) {
                    if (!!triggersId[index]) {
                        cardArray.push(configData[triggersId[index]]);
                    }
                    else {
                        break;
                    }
                }
                divs.push(cardArray);
            };
            console.log(divs);
            setDivArray(divs);

        } catch (err) {
            console.log(err);
        }

    };

    return (
        <div className="bp-c-neutral-dark-city mt3-l ttn">
            <div className="flex flex-column justify-center">
                <bds-paper elevation="secondary">
                    <div className="tc-ns mv2 mh3">
                        <bds-icon name="data-security" theme="outline" aria-label="Security Shield" />
                        <bds-typo variant="fs-16" italic bold="bold">Authorization Section</bds-typo>
                        <bds-input-password label="Namespace" value={namespace} />
                        <bds-input-password label="Hubspot Api Key" value="No Hapikey Detected" />
                    </div>
                </bds-paper>
            </div>

            {triggersId.length > 0 ? (
                <div className="tc-ns mv4-ns">
                    <div className="flex flex-column justify-center">
                        <bds-paper elevation="secondary">
                            <div className="tc-ns mv2 mh3">
                                <bds-icon name="message-active" theme="outline" aria-label="Active Message Label" />
                                <bds-typo variant="fs-16" italic bold="bold">Triggers Section</bds-typo>
                                {divArray.map((cards) =>
                                    <div>
                                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                                            {cards.map((trigger) =>
                                                <Grid item xs={3}>
                                                    <bds-paper elevation="static">
                                                        <div className="mh2 pv2">
                                                            <bds-icon name="message-active" theme="outline" aria-label="Ative Message Label" />
                                                            <div className="mb4">
                                                                <bds-typo variant="fs-16" line-height="double" italic="true">
                                                                    {trigger.templateId}
                                                                </bds-typo>
                                                            </div>
                                                            <bds-button variant="ghost" size="short" icon="notes" onClick={() => handleModalCreation(trigger)}>Editar</bds-button>
                                                        </div>
                                                    </bds-paper>
                                                </Grid>
                                            )}
                                        </Grid>
                                        <p>{cards.templateId}</p>
                                    </div>
                                )}
                            </div>
                        </bds-paper>
                    </div>
                </div>
            ) : (
                <div className="flex flex-column tc mv4 justify-center">
                    <bds-paper elevation="secondary">
                        <div className="tc-ns mv2 mh3">
                            <bds-icon name="message-sent" theme="outline" aria-label="message-sent" />
                            <bds-typo variant="fs-16" italic bold="bold">Triggers Section</bds-typo>
                        </div>
                        <bds-typo variant="fs-16" italic bold="regular">Nenhum template configurado</bds-typo>
                    </bds-paper>
                </div>
            )}
            <div className="flex flex-column">
                <bds-button variant='primary' size="standard" icon="file-new" onClick={() => handleModalCreation()}>Adicionar Gatilho</bds-button>
                <bds-modal open={openModal} close-button="false">
                    <div>
                        <div className="tc-ns mh1">
                            <bds-tabs>
                                <bds-tab group="tab1" label="Configuração de Template" />
                                <bds-tab group="tab2" label="Configuração de Redirecionamento" />
                            </bds-tabs>
                            <bds-tab-panel group="tab1">
                                <div className="mt2">
                                    <bds-select placeholder={modalInfo[0].templateId} icon="notes">
                                        {newTriggerModal !== true ? <bds-select-option/> : triggersId.map((trigger, index) =>
                                            <bds-select-option value={index} onClick={() => handleModalUpdate(trigger)}>{trigger}</bds-select-option>
                                        )}                                   
                                    </bds-select>
                                </div>
                                <div className="mt2">
                                    <bds-input is-textarea rows="3" disabled placeholder={templates[modalInfo[0].templateId] ? templates[modalInfo[0].templateId].text : defaultModalInfo.text}/>
                                </div>
                                <div className="mt2">
                                    <Grid container spacing={2} alignItems="center"> 
                                        {modalInfo[0].templateVariables.map((variable, index) =>
                                            <Grid item xs={3}>
                                                <div>
                                                    <bds-input is-textarea rows="1" disabled placeholder={index+1} />
                                                    <bds-input is-textarea rows="1" placeholder={modalInfo[0].templateVariables[index]} />
                                                </div>
                                            </Grid>
                                        // <div>
                                        //     <bds-input is-textarea rows="1" disabled placeholder={index+1} />
                                        //     <bds-input is-textarea rows="1" placeholder={modalInfo[0].templateVariables[index]} />
                                        // </div>
                                        )}
                                    </Grid>
                                </div>
                                <div/>
                            </bds-tab-panel>
                            <bds-tab-panel group="tab2">
                                <div className="mt2">
                                    <bds-select placeholder="Selecione o Sub-bot - Apenas em caso de Redirecionamentos" icon="conections">
                                        <bds-select-option value="s1">Skill 1</bds-select-option>
                                        <bds-select-option value="s2">Skill 2</bds-select-option>
                                        <bds-select-option value="s3">Skill 3</bds-select-option>
                                        <bds-select-option value="s4">Skill 4</bds-select-option>
                                        <bds-select-option value="s5">Skill 5</bds-select-option>
                                        <bds-select-option value="s6">Skill 6</bds-select-option>
                                    </bds-select>
                                </div>

                                <div className="mt2">
                                    <bds-select placeholder="Selecione o Bloco - Apenas em caso de Redirecionamentos" icon="builder-new-state">
                                        <bds-select-option value="b1">Bloco 1</bds-select-option>
                                        <bds-select-option value="b2">Bloco 2</bds-select-option>
                                        <bds-select-option value="b3">Bloco 3</bds-select-option>
                                        <bds-select-option value="b4">Bloco 4</bds-select-option>
                                        <bds-select-option value="b5">Bloco 5</bds-select-option>
                                        <bds-select-option value="b6">Bloco 6</bds-select-option>
                                    </bds-select>
                                </div>
                            </bds-tab-panel>
                        </div>
                    </div>
                    <bds-modal-action>
                        <div className="mr3">
                            <bds-button icon="file-new" variant='primary'>Salvar</bds-button>
                        </div>
                        <div>
                            <bds-button variant='delete' onClick={() => setOpenModal(false)}>Cancelar</bds-button>
                        </div>
                    </bds-modal-action>
                </bds-modal>
            </div>
        </div>
    );
};


Triggers.propTypes = {
    triggersId: PropTypes.any,
    namespace: PropTypes.any,
    configData: PropTypes.any,
    templates: PropTypes.any
};

export default Triggers;