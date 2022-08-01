import React from 'react';
import PropTypes from 'prop-types';
// import { useTranslation } from 'react-i18next';
import Card from '../../../../components/Card';
import NavTabs from '../../../../components/NavTabs';
import Triggers from '../Triggers';
// import DocsFields from '../../DocsFields';
// import { HomeFields } from '../../CardsFields';
// import { ContentsFields } from '../../ContentFields';

const MenuDialog = ({ selectedTab }) => {
    // const { t } = useTranslation();

    const renderTriggersTab = () => (
        <div className="w-100 flex">
            <div className="w-100 w-150-ns pt2 pt3-ns pl0 pl3-ns">
                <Triggers />
            </div>
        </div>
    );

    const renderAuthorizationTab = () => (
        <div className="w-100 flex">
            <div className="w-100 w-150-ns pt2 pt3-ns pl0 pl3-ns">
                <p>Autorizações Hubspot</p>
                {/* <ContentsFields /> */}
            </div>
        </div>
    );

    const options = [
        {
            key: 'triggers',
            label: 'Triggers',
            icon: 'message-sent',
            component: renderTriggersTab()
        },
        {
            key: 'authorization',
            label: 'Autorizathion',
            icon: 'data-security',
            component: renderAuthorizationTab()
        }
    ];

    return (
        <div className="mv4 w-100">
            <Card>
                <div className="mb2 mb0-ns pa3 pa4-ns">
                    <NavTabs
                        options={options}
                        selectedKey={selectedTab}
                        type="tabs"
                    />
                </div>
            </Card>
        </div>
    );
};

MenuDialog.propTypes = {
    selectedTab: PropTypes.string
};

export default MenuDialog;
