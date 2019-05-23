import React from 'react';

const Cards = ({
  product_id,
  name,
  description,
  price,
  discounted_price,
  thumbnail,
  history
}) => (
  <div style={{
    width: 200,
    marginTop: 50,
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: 15,
    marginLeft: 30,
    boxSizing: 'border-box',
    boxShadow: '0.5rem 0.5rem 3rem rgba(0,0,0,0.2)',
    cursor: 'pointer'
    }}
    onClick={() => history.push(`/product/${product_id}`)}
    >
    <img alt="" src={require(`../assets/product_images/${thumbnail}`)} style={{ width: 200, height: 200 }} />
    <p style={{ textAlign: 'center' }}>{name}</p>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <p style={{ textDecoration: 'line-through', marginLeft: 15 }}>${price}</p>
      <p style={{ marginRight: 15 }}>${discounted_price}</p>
    </div>
  </div>
)

export default Cards;
