import React, { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./admin.css";

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const {
        totalUsers,
        totalOrders,
        totalRevenue,
        products,
        topSellingProducts,
        adminUser,
        monthlyRevenue,
        weeklyRevenue,
        dailyRevenue,
        recentOrders,
        getUsersWithMostOrders
    } = useContext(AdminContext);


    const usersWithMostOrders = getUsersWithMostOrders()

    // Calculate product counts
    const totalProducts = products.length;
    const dogProducts = products.filter((product) => product.category === "dog").length;
    const catProducts = products.filter((product) => product.category === "cat").length;

    const monthlyChartData = {
        labels: Object.keys(monthlyRevenue), // Months
        datasets: [
            {
                label: "Monthly Revenue",
                data: Object.values(monthlyRevenue), // Revenue values
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const weeklyChartData = {
        labels: Object.keys(weeklyRevenue), // Weeks
        datasets: [
            {
                label: "Weekly Revenue",
                data: Object.values(weeklyRevenue), // Revenue values
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            },
        ],
    };

    const dailyChartData = {
        labels: Object.keys(dailyRevenue), // Days
        datasets: [
            {
                label: "Daily Revenue",
                data: Object.values(dailyRevenue), // Revenue values
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
            },
        ],
    };


// Calculate orders by state
const ordersByState = recentOrders.reduce((acc, order) => {
  const state = order.shipping?.state; // Accessing the state inside shipping
  if (state) { // Only process orders that have a defined state
      acc[state] = (acc[state] || 0) + 1;
  }
  return acc;
}, {});

// Convert the ordersByState object to an array for rendering
const ordersByStateArray = Object.entries(ordersByState)
  .map(([state, count]) => ({ state, count }))
  .sort((a, b) => a.state.localeCompare(b.state));

    return (
        <div className="admin-dashboard-container">
            <div className="DashboardHead">
                <h1>Dash<span>board</span></h1>
            </div>

            <div className="admin-dashboardCard-container">
                {/* Dashboard Cards */}
                <div className="allDashBoardCards">
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Total Users</h3>
                            <p>{totalUsers}</p>
                        </div>
                    </div>
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Total Orders</h3>
                            <p>{totalOrders}</p>
                        </div>
                    </div>
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Total Revenue</h3>
                            <p>₹{totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Product Overview</h3>
                            <p><strong>Total Products: </strong>{totalProducts}</p>
                            <p><strong>Cat Products: </strong>{catProducts}</p>
                            <p><strong>Dog Products: </strong>{dogProducts}</p>
                        </div>
                    </div>
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Top Selling Products</h3>
                            <ul>
                                {topSellingProducts.map((product) => (
                                    <li key={product.id}>{product.name} ({product.category})</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {adminUser && (
                        <div className="admin-dashcard">
                            <div className="admin-bg"></div>
                            <div className="admin-blob"></div>
                            <div className="admin-dashCardcontent">
                                <h3>Admin Details</h3>
                                <p className="adminDetailsCard">Name: {adminUser.username}</p>
                                <p className="adminDetailsCard">Email: {adminUser.email}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Revenue Charts */}
                <div className="revenueContainer">
                    <h3>Revenue Details</h3>
                    <div className="revenueDetails">
                        <div className="admin-chart-container">
                            <h2>Monthly Revenue</h2>
                            <Bar data={monthlyChartData} options={{ responsive: true }} />
                        </div>
                        <div className="admin-chart-container">
                            <h2>Weekly Revenue</h2>
                            <Bar data={weeklyChartData} options={{ responsive: true }} />
                        </div>
                        <div className="admin-chart-container">
                            <h2>Daily Revenue</h2>
                            <Bar data={dailyChartData} options={{ responsive: true }} />
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <h2 className="revenueContainer2">Order Details</h2>
                <div className="admin-table-container">
                    <div className="table1admin">
                      <h2>Recent Orders</h2>
                      <table className="admin-recent-orders-table">
                          <thead>
                              <tr>
                                  <th>Order ID</th>
                                  <th>Amount</th>
                                  <th>User Email</th>
                              </tr>
                          </thead>
                          <tbody>
                              {recentOrders
                                  .slice()
                                  .reverse()
                                  .map((order) => (
                                      <tr key={order.orderId}>
                                          <td>{order.orderId}</td>
                                          <td>₹{order.amount.toFixed(0)}</td>
                                          <td>{order.email}</td>
                                      </tr>
                                  ))}
                          </tbody>
                      </table>
                    </div>

                    <div className="table2admin">
                      <h2>Users with Most Orders</h2>
                      <table className="admin-recent-orders-table">
                          <thead>
                              <tr>
                                  <th>Email</th>
                                  <th>No. of Orders</th>
                                  <th>Total Amount</th>
                              </tr>
                          </thead>
                          <tbody>
                              {usersWithMostOrders.map((user, index) => (
                                  <tr key={index}>
                                      <td>{user.email}</td>
                                      <td>{user.count}</td>
                                      <td>₹{user.totalAmount.toFixed(2)}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
