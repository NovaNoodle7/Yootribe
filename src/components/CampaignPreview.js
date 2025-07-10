import React from 'react';
import {getKeywordById} from "../api";



const CampaignPreview = ({ campaign }) => {
  console.log(campaign);
  return (
    <div className={'campaign-preview'}>
      <img className={'campaign-banner'} src={URL.createObjectURL(campaign.cover)} alt={'uploaded'} />
      <div className={'campaign-content'}>
        <img src={URL.createObjectURL(campaign.logo)} alt={'uploaded'} />
        <div className={'campaign-text'}>
          <div className={'campaign-keywords'}>
            {campaign.keyword_ids.length > 0 && campaign.keyword_ids.map((item) => {
              getKeywordById(item)
                .then((res) => {
                  return (
                    <p>
                      {res.keyword.word}
                    </p>
                  )
                })
            })}
          </div>
          <h2>
            {campaign.name}
          </h2>
          <p>
            {campaign.title}
          </p>
        </div>
      </div>
    </div>
  )
};



export default CampaignPreview;