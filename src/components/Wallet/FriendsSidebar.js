import Friend from './Friend';

const FriendsSidebar = (props) => {
  const { usersJson } = props;
  return (
    <div className={'wallet-friends-list'}>
      <div className={'wallet-friend-upper'}>
        <h3>Who is</h3>
        <span>
          online <strong>?</strong>
        </span>
      </div>
      <div className={'friend-list'}>
        {usersJson.map((item) => {
          return <Friend key={item.name} data={item} />;
        })}
      </div>
    </div>
  );
};
export default FriendsSidebar;
