import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trackOrderById, updateOrderStatus } from '../../services/orderService';
import classes from './ChangeStatus.module.css';
import CustomDropdown from './CustomDropdown';

const AdminOrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      trackOrderById(orderId)
        .then(order => {
          setOrder(order);
          setStatus(order.status);
        })
        .catch(() => setError('Order not found.'));
    }
  }, [orderId]);

  const handleStatusChange = async () => {
    try {
      await updateOrderStatus(orderId, status); // Update order status
      window.location.reload();
    } catch (error) {
      setError('Failed to update order status.');
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className={classes.container}>
      {order && (
        <div>
          <h2>Order #{order.id}</h2>
          <label>Status:</label>
          <CustomDropdown status={status} onChange={setStatus} />
          <button onClick={handleStatusChange}>Update Status</button>
        </div>
      )}
    </div>
  );
};

export default AdminOrderStatus;
