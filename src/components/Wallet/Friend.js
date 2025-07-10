import DummyImage from '../../assets/img/user-icon.png';

const Friend = (props) => {
  const { data } = props;
  return (
    <div className={'single-friend'}>
      <div className={'image-n-activity'}>
        <img className={'user-image'} src={DummyImage} /> {/* User Image: // */}
        <span
          className={data.is_active ? 'is-active friends-activity' : 'inactive friends-activity'}>
          ●
        </span>
      </div>
      <div className={'friend-name'}>
        <p>{data.name}</p> {/* UserName: // */}
        <span className={'sended'}>{data.time_sent}</span> {/* Active Before...? // */}
      </div>
    </div>
  );
};

export default Friend;
