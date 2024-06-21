import Card from 'react-bootstrap/Card';

import './infocard.css';

const InfoCard = () => {
    return (
        <Card style={{
            width: '22rem', height: '30rem', position: 'fixed', margin: '50px 0 0 20px',
            padding: '30px', gap: '10px',zIndex: 100
        }} >
            <Card style={{ width: '18rem', height: '8rem', backgroundColor: '#FFE333', }} >
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card style={{ width: '18rem', height: '18rem', backgroundColor: 'white', }}>
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                    </Card.Text>
                </Card.Body>
            </Card>

            <div className='card-flex'>
                <Card className='children'>
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className='children'>
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick example
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>


        </Card>
    )
}

export default InfoCard