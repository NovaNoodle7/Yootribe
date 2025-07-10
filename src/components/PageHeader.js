import ContentHeader from './micro/ContentHeader';
import BreadCrumbs from './micro/Breadcrumbs';
import homeIcon from '../assets/img/home.png';
import React from "react";

export const PageHeader = ({ tabs, currentTab, setCurrentTab, title, description }) => {
  return (
    <>
      <ContentHeader>
        <div className="container">
          {currentTab && (
            <BreadCrumbs>
              <button className={'root-nav'}>
                <img src={homeIcon} alt={'home-icon'} />
                <span>Dashboard</span>
              </button>
              <span className={'breadcrumb-separator'}> / </span>
              <button className={'active'}>{(tabs) ? tabs[currentTab]?.name : currentTab}</button>
            </BreadCrumbs>
          )}
          <div className="head-content">
            {title && <h2>{title}</h2>}
            <p dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
      </ContentHeader>
       
      {currentTab !== "info" && currentTab !== "confirmation" && currentTab !== "edit" ?
        tabs && Object.keys(tabs)?.length > 0 && (
          <div className="nft-nav-buttons-wrapper w-bg container">
            <div className="nft-nav-buttons">
              {Object.keys(tabs).map((tab, iTab) => {
                const tabData = tabs[tab];

                if (!tabData || tabData.hidden) {
                  return null;
                }

                return (
                  <button
                    className={currentTab === tab ? 'active' : ''}
                    key={iTab}
                    onClick={() => {
                      if (!tabData.onClick && setCurrentTab) {
                        setCurrentTab(tab);
                      } else if (tabData?.onClick) {
                        tabData.onClick(tab);
                      }
                    }}>
                    {tabData?.name}
                    {tabData?.count > -1 && <span className="nft-count">{tabData.count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )
       :''}

    </>
  );
};
