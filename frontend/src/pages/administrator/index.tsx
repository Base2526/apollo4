import React from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const AdministratorPage: React.FC = () => {
    const navigate = useNavigate();
    const cardsData = [
        { title: 'Products', details: 'Products system', path:'/administrator/products' },
        { title: 'Users', details: 'Users system', path:'/administrator/userlist' },
        { title: 'Import data', details: 'Import system', path:'/administrator/import' },
        { title: 'Faker', details: 'Faker system', path:'/administrator/faker' },
        { title: 'Notice', details: 'Notice system', path:'/administrator/noticelist' },
        { title: 'Cal tree', details: 'Cal tree system', path:'/administrator/caltree' },
        { title: 'Files', details: 'Files system', path:'/administrator/filelist' },
        { title: 'Logs', details: 'Logs system', path:'/administrator/dblog' },
        { title: 'Other', details: 'Other', path:'/administrator/Other' },
    ];
    
    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={16}>
                {cardsData.map((card, index) => (
                    <Col span={5} key={index} style={{"margin": "3px"}}>
                        <Card
                            hoverable 
                            title={card.title} 
                            bordered={false} 
                            onClick={()=> navigate(card.path) }>
                            <p>{card.details}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
};

export default AdministratorPage;
