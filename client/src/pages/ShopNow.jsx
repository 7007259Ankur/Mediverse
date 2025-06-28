import React, { useState } from 'react';
import './ShopNow.css';
import { FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import logo from '../assets/logo.png';
import Cart from './Cart';

// Import images from src/assets/
import paracetamolImg from '../assets/Para.png';
import ibuprofenImg from '../assets/Ibu.png';
import amoxicillinImg from '../assets/Amo.png';
import loratadineImg from '../assets/Lora.png';
import omeprazoleImg from '../assets/Omi.png';
import cetirizineImg from '../assets/Cit.png';
import aspirinImg from '../assets/Asp.png';
import simvastatinImg from '../assets/Sim.png';
import metforminImg from '../assets/Met.png';
import atorvastatinImg from '../assets/Ato.png';
import levothyroxineImg from '../assets/Levo.png';
import losartanImg from '../assets/Losa.png';
import albuterolImg from '../assets/Albu.png';
import gabapentinImg from '../assets/Gaba.png';
import hydrochlorothiazideImg from '../assets/Hydro.png';
import sertralineImg from '../assets/Sertra.png';
import metoprololImg from '../assets/Meto.png';
import pantoprazoleImg from '../assets/Pant.png';
import tramadolImg from '../assets/Tram.png';
import diazepamImg from '../assets/Dia.png';

const medicines = [
  { id: 1, name: 'Paracetamol', price: 5.99, description: 'Pain reliever and fever reducer', image: paracetamolImg },
  { id: 2, name: 'Ibuprofen', price: 7.49, description: 'Anti-inflammatory pain reliever', image: ibuprofenImg },
  { id: 3, name: 'Amoxicillin', price: 12.99, description: 'Antibiotic for bacterial infections', image: amoxicillinImg },
  { id: 4, name: 'Loratadine', price: 8.99, description: 'Antihistamine for allergies', image: loratadineImg },
  { id: 5, name: 'Omeprazole', price: 14.99, description: 'Acid reducer for heartburn', image: omeprazoleImg },
  { id: 6, name: 'Cetirizine', price: 6.49, description: 'Allergy relief medication', image: cetirizineImg },
  { id: 7, name: 'Aspirin', price: 4.99, description: 'Pain reliever and blood thinner', image: aspirinImg },
  { id: 8, name: 'Simvastatin', price: 18.99, description: 'Cholesterol-lowering medication', image: simvastatinImg },
  { id: 9, name: 'Metformin', price: 9.99, description: 'Diabetes medication', image: metforminImg },
  { id: 10, name: 'Atorvastatin', price: 21.99, description: 'Cholesterol management', image: atorvastatinImg },
  { id: 11, name: 'Levothyroxine', price: 15.49, description: 'Thyroid hormone replacement', image: levothyroxineImg },
  { id: 12, name: 'Losartan', price: 11.99, description: 'Blood pressure medication', image: losartanImg },
  { id: 13, name: 'Albuterol', price: 23.99, description: 'Asthma inhaler', image: albuterolImg },
  { id: 14, name: 'Gabapentin', price: 17.49, description: 'Nerve pain medication', image: gabapentinImg },
  { id: 15, name: 'Hydrochlorothiazide', price: 7.99, description: 'Water pill for blood pressure', image: hydrochlorothiazideImg },
  { id: 16, name: 'Sertraline', price: 19.99, description: 'Antidepressant medication', image: sertralineImg },
  { id: 17, name: 'Metoprolol', price: 10.49, description: 'Beta blocker for heart conditions', image: metoprololImg },
  { id: 18, name: 'Pantoprazole', price: 16.99, description: 'Acid reflux medication', image: pantoprazoleImg },
  { id: 19, name: 'Tramadol', price: 24.99, description: 'Pain reliever for moderate pain', image: tramadolImg },
  { id: 20, name: 'Diazepam', price: 29.99, description: 'Anti-anxiety medication', image: diazepamImg }
];


// ... (keep all your existing image imports and medicines array)

const ShopNow = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (medicine) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === medicine.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...medicine, quantity: 1 }];
    });
  };

  const Navbar = ({ cartItems, setCartItems, setIsCartOpen }) => (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Pharmacy Logo" className="logo" />
        <div className="delivery-info">
          <FaMapMarkerAlt className="icon" />
          <div>
            <span className="delivery-label">Express delivery to</span>
            <button className="pincode-btn">Select Pincode</button>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <a href="#offers" className="nav-link">
          <FaTag className="icon" /> Offers
        </a>
        <Cart cartItems={cartItems} setCartItems={setCartItems} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      </div>
    </nav>
  );

  return (
    <>
      <Navbar cartItems={cartItems} setCartItems={setCartItems} setIsCartOpen={setIsCartOpen} />
      <div className="shop-container">
        <h1 className="shop-title">Pharmacy Products</h1>
        <div className="medicines-grid">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="medicine-card">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="medicine-image"
              />
              <div className="medicine-details">
                <h3 className="medicine-name">{medicine.name}</h3>
                <p className="medicine-description">{medicine.description}</p>
                <div className="medicine-footer">
                  <span className="medicine-price">${medicine.price.toFixed(2)}</span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(medicine)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopNow;