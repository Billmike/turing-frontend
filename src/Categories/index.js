import React from 'react'

const Category = ({ setCategory, category }) => {
  return (
    <div style={{
      position: 'absolute',
      marginLeft: 10,
      boxShadow: '0.5rem 0.5rem 3rem rgba(0,0,0,0.2)',
      backgroundColor: '#FAFAFA',
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 20,
      marginTop: 30,
      borderRadius: 5,
      paddingBottom: 10
    }}>
      <h4>Categories</h4>
      <p
        onClick={() => setCategory('french', '1')}
        style={{
          backgroundColor: category === 'french' ? 'red' : '',
          textAlign: 'center',
          paddingTop: category === 'french' ? 5 : '',
          paddingBottom: category === 'french' ? 5 : '',
          borderRadius: category === 'french' ? 5 : '',
          color: category === 'french' ? 'white' : 'black',
          cursor: 'pointer'
        }}
      >French</p>
      <p
        onClick={() => setCategory('italian', '2')}
        style={{
          backgroundColor: category === 'italian' ? 'red' : '',
          textAlign: 'center',
          paddingTop: category === 'italian' ? 5 : '',
          paddingBottom: category === 'italian' ? 5 : '',
          borderRadius: category === 'italian' ? 5 : '',
          color: category === 'italian' ? 'white' : 'black',
          cursor: 'pointer'
        }}
      >Italian</p>
      <p
        onClick={() => setCategory('irish', '3')}
        style={{
          backgroundColor: category === 'irish' ? 'red' : '',
          textAlign: 'center',
          paddingTop: category === 'irish' ? 5 : '',
          paddingBottom: category === 'irish' ? 5 : '',
          borderRadius: category === 'irish' ? 5 : '',
          color: category === 'irish' ? 'white' : 'black',
          cursor: 'pointer'
        }}
        >Irish</p>
      <p
        onClick={() => setCategory('animal', '4')}
        style={{
          backgroundColor: category === 'animal' ? 'red' : '',
          textAlign: 'center',
          paddingTop: category === 'animal' ? 5 : '',
          paddingBottom: category === 'animal' ? 5 : '',
          borderRadius: category === 'animal' ? 5 : '',
          color: category === 'animal' ? 'white' : 'black',
          cursor: 'pointer'
        }}
        >Animal</p>
      <p
        onClick={() => setCategory('flower', '5')}
        style={{
          backgroundColor: category === 'flower' ? 'red' : '',
          textAlign: 'center',
          paddingTop: category === 'flower' ? 5 : '',
          paddingBottom: category === 'flower' ? 5 : '',
          borderRadius: category === 'flower' ? 5 : '',
          color: category === 'flower' ? 'white' : 'black',
          cursor: 'pointer'
        }}
      >Flower</p>
      <p
        onClick={() => setCategory('christmas', '6')}
        style={{
          backgroundColor: category === 'christmas' ? 'red' : '',
          textAlign: 'center',
          paddingTop: category === 'christmas' ? 5 : '',
          paddingBottom: category === 'christmas' ? 5 : '',
          borderRadius: category === 'christmas' ? 5 : '',
          color: category === 'christmas' ? 'white' : 'black',
          cursor: 'pointer'
        }}
        >Christmas</p>
      <p
        onClick={() => setCategory('val', '7')}
        style={{
          backgroundColor: category === 'val' ? 'red' : '',
          textAlign: 'center',
          paddingTop: category === 'val' ? 5 : '',
          paddingBottom: category === 'val' ? 5 : '',
          borderRadius: category === 'val' ? 5 : '',
          color: category === 'val' ? 'white' : 'black',
          cursor: 'pointer'
        }}
      >Valentine's</p>
    </div>
  )
}

export default Category;
