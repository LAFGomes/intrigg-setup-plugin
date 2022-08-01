import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as queryString from 'query-string';

import styles from './navtab.module.scss';

const NavTabs = ({
    options,
    selectedKey,
    type = 'tabs',
    fallbackSelected = () => {}
}) => {
    const location = useLocation();
    const history = useHistory();
    const [selected, setSelected] = useState(selectedKey);

    useEffect(() => {
        const { search } = location;
        if (!!search) {
            const params = queryString.parse(search);
            setSelected(!!params.tab ? params.tab : selectedKey);
        }
        // eslint-disable-next-line
    }, [location]);

    useEffect(() => {
        setSelected(selectedKey);
    }, [selectedKey]);

    const navTabsClass = classNames({
        [`${styles.nav}`]: true,
        [`${styles['nav-pills']}`]: type === 'pills',
        [`${styles['nav-tabs']}`]: type === 'tabs'
    });

    const navLinkClass = (tabId, disabled = false) =>
        classNames({
            pointer: true,
            [`${styles['nav-link']}`]: true,
            [`${styles.active}`]: selected === tabId,
            [`${styles.disabled}`]: disabled
        });

    const tabClass = (tabId) =>
        classNames({
            [`${styles['tab-pane']}`]: true,
            [`${styles.active}`]: selected === tabId
        });

    const handleSelected = (key) => {
        history.replace(`?tab=${key}`);
        setSelected(key);
        fallbackSelected(key);
    };

    const handleKeyDown = (ev, key) =>{
        if(ev.keyCode === 9){
            handleSelected(key);
        }
    };

    const renderNavs = () =>
        options.map((item) => (
            <li key={`nav_item_${item.key}`} className={styles['nav-item']}>
                <div
                    role = "button"
                    tabIndex={0}
                    className={navLinkClass(item.key, !!item.disabled)}
                    onClick={() => handleSelected(item.key)}
                    onKeyDown={() => handleKeyDown(item.key)}
                >
                    {!!item.icon && (
                        <div
                            data-testid={`nav_icon_${item.key}`}
                            className="mr2"
                        >
                            <bds-icon name={item.icon} />
                        </div>
                    )}
                    {item.label}
                </div>
            </li>
        ));

    const renderTabs = () =>
        options.map((item) => (
            <div key={`tab_pane_${item.key}`} className={tabClass(item.key)}>
                {item.component}
            </div>
        ));

    return (
        <>
            <ul className={navTabsClass}>{!!options && renderNavs()}</ul>
            <div className={styles['tab-content']} id="tab-content">
                {!!options && renderTabs()}
            </div>
        </>
    );
};

NavTabs.propTypes = {
    options: PropTypes.array,
    selectedKey: PropTypes.string,
    type: PropTypes.string,
    fallbackSelected: PropTypes.func
};

export default NavTabs;
