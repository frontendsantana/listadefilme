
import React, { useEffect, useState } from 'react';
import {Layout, Input, Row, Col, Card, 
  Tag, Spin, Alert, Modal, Typography} from 'antd';
import 'antd/dist/antd.css';

const API_KEY = '1f54bd990f1cdfb230adb312546d765d';
const {Header, Content, Footer} = Layout;
const {Search} = Input;
const {Meta} = Card;
const TextTitle = Typography.Title;

const SearchBox = ({searchHandler}) =>{
  return(
    <Row>
      <Col span={12} offset={6}>
        <Search placeholder="Filme, Série ou Episódio"
          enterButton="Search"
          size="large"
          onSearch={value => searchHandler(value)}
        />
      </Col>
    </Row>
  )
}

const ColCardBox =({Title, imdbID, Poster, Type, ShowDetail, DetailRequest, ActivateModal}) =>{
  
  const clickHandler = () =>{

    ActivateModal(true);
    DetailRequest(true);
    
    fetch('http://omdbapi.com/?s=${imdbID}&apikey={API_KEY}')
    .then(resp => resp)
    .then(resp => resp.json())
    .then(response => {
      DetailRequest(false);
      ShowDetail(response);
    })
    .catch(({message}) =>{
      DetailRequest(false);
    })
    
  }

  return (
    <Col style={{margin:'20px 0'}} className="gutter-row" span={4}>
      <div className="gutter-box">
        <Card 
           style={{width:200}} cover={
          <img alt={Title} src={Poster}/>
          }
          onClick={() => clickHandler()}>

          <Meta title={Title} description={false}/>

           <Row style={{marginTop:'10px'}} className="gutter-row">
              <Col>
                <Tag color= "blue">{Type}</Tag>
              </Col>
           </Row>
        </Card>

      </div>

    </Col>
  )

}

const MovieDetail = ({Title, Poster, imdbRating, Rated, Runtime, Genre, Plot}) =>{
  return (
    <Row>
      <Col span={11}>
        <img src={Poster} alt={Title}/>
      </Col>
      <Col span={13}>
        <Row>
          <Col span={21}>
            <TextTitle level={4}>{Title}</TextTitle>
          </Col>
          <Col span={3} style={{textAlign:'right'}}>
            <TextTitle level={4}><span style={{color: 'white'}}>{imdbRating}</span></TextTitle>
          </Col>
        </Row>
        <Row style={{marginBottom:'20px'}}>
          <Col>
            <Tag>{Rated}</Tag>
            <Tag>{Runtime}</Tag>
            <Tag>{Genre}</Tag>
          </Col>
        </Row>
        <Row>
          <Col>{Plot}</Col>
        </Row>
      </Col>
    </Row>
  
  )
}

const Loader = () =>(
  <div style={{margin: '20px 0', textAlign:'center'}}>
    <Spin/>
  </div>
)



function App (){

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQuery] = useState('');
  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false);


  useEffect(() => {

    setLoading(true);
    setError(null);
    setData(null);
  
    fetch('http://omdbapi.com/?i=${imdbID}&apikey=${API_KEY}')
    .then(resp => resp)
    .then(resp => resp.json())
    .then(response => {
      if (response.Response === 'False'){
        setError(response.Error);
      }
      else {
        setData(response.Search);
      }
      setLoading(false);
    })
    .catch(({message}) =>{
      setError(message);
      setLoading(false);
    })
  }, [q]);

  return (
     <div className="App">
        <Layout className="layout">
          <Header>
            <div style={{textAlign: 'center'}}>
              <TextTitle style={{color: 'white', marginTop: '14px'}} level={3}>Lista de Filmes</TextTitle>
            </div>
          </Header>
          <Content style={{padding: '0 50px'}}>
            <div style={{background: 'white', padding: 24, minHeight: 280 }}>
               <SearchBox searchHandler={setQuery}/>
               <br/>
               <Row gutter={16} type="flex" justify="center">
                        {loading && <Loader/>}
                        {error !== null && 
                          <div style={{margin: '20px 0'}}>
                             <Alert message={error} type="error"/>
                          </div>
                        }

                  {data !== null && data.lenght > 0 && data.map((result, index) =>(
                    <ColCardBox
                      ShowDetail={setShowDetail}
                      DetailRequest={setDetailRequest}
                      ActivateModal={setActivateModal}
                      key={index}
                      {...result}/>
                 ))}
               </Row>
             </div>
           <Modal
             title="Detail"
             centered
             visible={activateModal}
             onCancel={() => setActivateModal(false)}
             footer={null}
             width={800}>
             {detailRequest === false ?
               (<MovieDetail {...detail}/>) :
                 (<Loader/>)
              }
           </Modal>
         </Content>
           <Footer style={{textAlign:'center'}}>App Modelo - API de OMDBapi.com</Footer>
        </Layout>
     </div>
   )
}

export default App

