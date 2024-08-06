import { FC } from 'react';
import { Card, Avatar, Descriptions } from 'antd';

import { useDispatch, useSelector } from 'react-redux';

const ProfilePage: FC = () => {
  

  const { profile } = useSelector(state => state.user);

  const user = {
    name: profile?.current?.displayName,
    email: profile?.current?.email,
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    avatar: 'https://www.example.com/avatar.jpg', // Replace with your avatar URL
  };

  return (
    <div style={{ padding: '3px' }}>
        <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size={100} src={user.avatar} />
                <div style={{ marginLeft: '20px' }}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            </div>
            <Descriptions title="User Information" bordered style={{ marginTop: '20px' }}>
                <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
                <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
            </Descriptions>
        </Card>
    </div>
  );
};

export default ProfilePage;
