import React, { useEffect, useState } from 'react';
import { getReviews, trackOrder } from '../../services/analysService';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import classes from './FoodAnalys.module.css';
import { CSVLink } from 'react-csv';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, TimeScale);

export default function FoodAnalys() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncomeTab, setSelectedIncomeTab] = useState('daily');
  const [selectedChart, setSelectedChart] = useState(null);
  const [financialData, setFinancialData] = useState([]);
  const [peakHours, setPeakHours] = useState(null);
  const [selectedSentiment, setSelectedSentiment] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await trackOrder();
        const reviewData = await getReviews();
        setOrders(orderData);
        setReviews(reviewData);
        calculatePeakHours(orderData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


    const calculatePeakHours = (orderData) => {
    const hours = Array(24).fill(0);

    orderData.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hours[hour] += 1;
    });

      const maxOrders = Math.max(...hours);
    const peakHourIndices = hours.reduce((indices, orders, hour) => {
      if (orders === maxOrders) indices.push(hour);
      return indices;
    }, []);
    setPeakHours(peakHourIndices);
  };

const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0); // Calculate total revenue

  const orderStatuses = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const orderBarData = {
    labels: Object.keys(orderStatuses),
    datasets: [
      {
        label: 'Number of Orders',
        data: Object.values(orderStatuses),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  const sentimentScores = reviews.map((review) => review.sentimentScore);
  const positiveReviews = sentimentScores.filter((score) => score > 0).length;
  const negativeReviews = sentimentScores.filter((score) => score < 0).length;
  const neutralReviews = sentimentScores.filter((score) => score === 0).length;

  const sentimentDoughnutData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [positiveReviews, negativeReviews, neutralReviews],
        backgroundColor: ['#4CAF50', '#FF5252', '#FFCA28'],
        hoverBackgroundColor: ['#66BB6A', '#FF6E6E', '#FFD54F'],
      },
    ],
  };

  const foodSales = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      const foodName = item.food.name;
      acc[foodName] = (acc[foodName] || 0) + item.quantity;
    });
    return acc;
  }, {});

  const sortedFoodSales = Object.entries(foodSales).sort((a, b) => b[1] - a[1]);

  const topSellingFoodData = {
    labels: sortedFoodSales.map((food) => food[0]),
    datasets: [
      {
        label: 'Number of Sales',
        data: sortedFoodSales.map((food) => food[1]),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  const formatDate = (timestamp, period) => {
    const d = new Date(timestamp);
    if (period === 'daily') return d.toLocaleDateString();
    if (period === 'weekly') return `Week ${Math.ceil(d.getDate() / 7)} - ${d.getFullYear()}`;
    if (period === 'monthly') return `${d.getMonth() + 1}-${d.getFullYear()}`;
  };

  const incomeByPeriod = (orders, period) => {
    return orders.reduce((acc, order) => {
      const date = formatDate(order.createdAt, period);
      acc[date] = (acc[date] || 0) + order.totalPrice;
      return acc;
    }, {});
  };



  const dailyIncome = incomeByPeriod(orders, 'daily');
  const weeklyIncome = incomeByPeriod(orders, 'weekly');
  const monthlyIncome = incomeByPeriod(orders, 'monthly');

  const createLineChartData = (incomeData, label) => ({
    labels: Object.keys(incomeData),
    datasets: [
      {
        label: `${label} Income`,
        data: Object.values(incomeData),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        borderWidth: 2,
      },
    ],
  });
  const dailyIncomeData = createLineChartData(dailyIncome, 'Daily');
  const weeklyIncomeData = createLineChartData(weeklyIncome, 'Weekly');
  const monthlyIncomeData = createLineChartData(monthlyIncome, 'Monthly');

  const renderIncomeChart = () => {
    if (selectedIncomeTab === 'daily') {
      return <Line data={dailyIncomeData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} onClick={() => handleIncomeChartClick('daily')} />;
    }
    if (selectedIncomeTab === 'weekly') {
      return <Line data={weeklyIncomeData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} onClick={() => handleIncomeChartClick('weekly')} />;
    }
    if (selectedIncomeTab === 'monthly') {
      return <Line data={monthlyIncomeData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} onClick={() => handleIncomeChartClick('monthly')} />;
    }
  };

  const handleBarChartClick = () => {
    setSelectedChart('orderStatus');
  };

const handleDoughnutChartClick = (event) => {
  const chart = event.chart;
  const activePoints = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, false);
  
  if (activePoints.length > 0) {
    const { index } = activePoints[0];
    if (index === 0) {
      setSelectedSentiment('positive');
    } else if (index === 1) {
      setSelectedSentiment('negative');
    } else if (index === 2) {
      setSelectedSentiment('neutral');
    }
  }
};

const getFilteredReviewsBySentiment = (sentiment) => {
  if (sentiment === 'positive') {
    return reviews.filter(review => review.sentimentScore > 0);
  } else if (sentiment === 'negative') {
    return reviews.filter(review => review.sentimentScore < 0);
  } else if (sentiment === 'neutral') {
    return reviews.filter(review => review.sentimentScore === 0);
  }
  return [];
};


  const handleTopSellingFoodChartClick = () => {
    setSelectedChart('topSellingFood');
  };

  
  const handleIncomeChartClick = (period) => {
    const incomeData = incomeByPeriod(orders, period);
    setFinancialData(Object.entries(incomeData)); // Set financial data for the table
    setSelectedChart('financial'); // Update selected chart
  };

  // Function to prepare financial data for CSV
const prepareFinancialDataForCSV = () => {
  return financialData.map(([period, income]) => ({
    Period: period,
    Income: income.toFixed(2) + ' $',
  }));
};



// Function to prepare top-selling food data for CSV
const prepareTopSellingFoodForCSV = () => {
  return sortedFoodSales.map(([food, sales]) => ({
    FoodItem: food,
    SalesCount: sales,
  }));
};

// Function to prepare order data for CSV
const prepareOrdersForCSV = () => {
  return orders.map(order => ({
    OrderID: order._id,
    Food: order.items.map(item => item.food.name).join(', '),
    Name: order.name,
    TotalPrice: order.totalPrice,
    Status: order.status,
  }));
};




  return (
    <div className={classes.dashboard}>
      <h1 className={classes.dashboardTitle}>Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={classes.dashboardContent}>
          <div className={classes.metrics}>
            <div className={classes.metricCard}>
              <h3>Total Orders</h3>
              <p>{orders.length}</p>
            </div>
             <div className={classes.metricCard}>
              <h3>Daily Revenue</h3>
              <p>{totalRevenue.toFixed(2)} $</p> {/* Display total revenue */}
            </div>

            <div className={classes.metricCard}>
              <h3>Top Selling Food</h3>
              <p>{sortedFoodSales.length ? sortedFoodSales[0][0] : 'N/A'}</p>
            </div>
            <div className={classes.metricCard}>
              <h3>Peak Hours</h3>
              <p>{peakHours ? peakHours.map(hour => `${hour}:00`).join(', ') : 'N/A'}</p>
            </div>
           <div className={classes.metricCard}>
              <h3>Total Reviews</h3>
              <p>{reviews.length}</p>
            </div>
           
            
          </div>

         
          
          {/* Sentiment Analysis Section */}
          <section className={classes.medium}  >
            <div className={classes.chart} >
            <br/>  
            <h2>Sentiment Analysis</h2>
    
            <Doughnut
              data={sentimentDoughnutData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
              onClick={handleDoughnutChartClick} // Handle chart click
            />
            <br/> 
            </div>
           
          </section>
           {/* Orders Section */}
          <section className={classes.medium} >
            
            {/* Bar Chart for Orders by Status */}
            <div  className={classes.chart} > 
              <h2> Daily Orders Overview</h2>
              <Bar
                data={orderBarData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Order Status',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Number of Orders',
                      },
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
                onClick={handleBarChartClick} // Handle chart click
              />
            </div>
          </section>


          {/* Most Sold Food Section */}
          <section className={classes.medium} >
            <div className={classes.chart} >
              <br/>  
            <h2>Most Sold Food Items</h2>
            <Bar
              data={topSellingFoodData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Food Items',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Number of Sales',
                    },
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
              onClick={handleTopSellingFoodChartClick} // Handle chart click
            />
            <br/>  
            </div>
          </section>


          {/* Income Analysis Section */}
          <section className={classes.large} >
            <div className={classes.chart} >
              <br/>  
            <h2>Income Analysis</h2>
            <div className={classes.incomeTabs}>
              <button onClick={() => setSelectedIncomeTab('daily')}>Daily</button>
              <button onClick={() => setSelectedIncomeTab('weekly')}>Weekly</button>
              <button onClick={() => setSelectedIncomeTab('monthly')}>Monthly</button>
            </div>
            {renderIncomeChart()}   
            <br/>  
            </div>
          </section>
        </div>
        
      )}

         {/* Financial Data Table */}
          {selectedChart === 'financial' && (
            <div className={classes.tableSection}>
              <h2>{selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Income Data</h2>

              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>{selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Period</th>
                    <th>Income</th>
                  </tr>
                </thead>
                <tbody>
                  {financialData.map(([period, income]) => (
                    <tr key={period}>
                      <td>{period}</td>
                      <td>{income.toFixed(2)} $</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
             <CSVLink data={prepareFinancialDataForCSV()} filename="financial_data.csv">
             <button className={classes.exportButton}>Export to CSV</button>
             </CSVLink>
            </div>
          )}

{selectedSentiment && (
  <div className={classes.tableSection}>
    <h2>{selectedSentiment.charAt(0).toUpperCase() + selectedSentiment.slice(1)} Reviews</h2>
    <table className={classes.table}>
      <thead>
        <tr>
          <th>Food ID</th>
          <th>User Name</th>
          <th>Comment</th>
          <th>Sentiment Score</th>
        </tr>
      </thead>
      <tbody>
        {getFilteredReviewsBySentiment(selectedSentiment).map(review => (
          <tr key={review._id}>
            <td>{review.foodId}</td>
            <td>{review.userName}</td>
            <td>{review.comment}</td>
            <td>{review.sentimentScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {selectedChart === 'topSellingFood' && (
        <div className={classes.tableSection}>
          <h3>Top Selling Food Data</h3>

          <table className={classes.table}>
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Sales Count</th>
              </tr>
            </thead>
            <tbody>
              {sortedFoodSales.map(([food, sales]) => (
                <tr key={food}>
                  <td>{food}</td>
                  <td>{sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
        <CSVLink data={prepareTopSellingFoodForCSV()} filename="top_selling_food.csv">
          <button className={classes.exportButton}>Export to CSV</button>
         </CSVLink>
        </div>
      )}
      {selectedChart === 'orderStatus' && (
        <>

        <h2>Order Status</h2>
      <table className={classes.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Food</th>
                  <th>Name</th>
                  <th>Total Price</th>
                 <th>Order Hour</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.items.map(item => item.food.name).join(', ')}</td>
                    <td>{order.name}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
           <br/>
          <CSVLink data={prepareOrdersForCSV()} filename="orders.csv">
          <button className={classes.exportButton}>Export to CSV</button>
         </CSVLink>
            </>
             )}
    </div>
     
  );
}
