import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import placeHolderImg from '../../assets/img/user-icon.png';
import { SendIcon } from '../../assets/icons';


const MemberListing = (props) => {
  const { memberList, theme } = props;
  const user = useSelector((state) => state?.auth?.value?.user);
  const [membersFilter, setMembersFilter] = useState('');

  const userFilter = useMemo(() => {
    memberList?.filter((u) => u.includes(membersFilter?.toLowerCase()))
  }, [membersFilter]);


  return (
    <div className={`member-list ${theme}`}>
      <div className={'whos-online'}>
        <h3>
          Who is <span>Online?</span>
        </h3>
      </div>
      {/* <div className='member-search'>
        <input 
        className={'pn-msg-input__textarea'} 
        value={membersFilter} 
        type={'text'} 
        placeholder='Search...' 
        onChange={(e) => setMembersFilter(e.target.value)} />
        <button onClick={() => userFilter()}>
          <SendIcon />
        </button>
      </div> */}
      <div className='members'>
        {memberList?.map((item) => (
          <div key={item} className='single-member'>
            {user.username === item ? <img src={user?.image} alt={'user'} /> : <img src={placeHolderImg} alt={'user'} />}
            
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberListing;