import React, { useState , useRef } from 'react'
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Farmsenselogo from '../images/Framsenselogo.png';
import autoTable from "jspdf-autotable";
import allorders from '../icons/orders.png';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportGeneration() {

    const [StartingDate , setStartingDate] = useState("");
    const [EndingDate , setEndingDate] = useState("");
    const [fetchedData , setFetchedData] = useState([]);
    const [MostOrderingItem , setMostOrderingItem] = useState("");
    const [MostOrderingUser , setMostOrderingUser] = useState("");
    const chartRef = useRef(null);
    const [dateError, setDateError] = useState("");

    //validation
    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartingDate(newStartDate);
        
        if (EndingDate && newStartDate > EndingDate) {
            setDateError("Start date cannot be after end date");
        } else {
            setDateError("");
        }
    };

    //validation
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndingDate(newEndDate);
        
        if (StartingDate && newEndDate < StartingDate) {
            setDateError("End date cannot be before start date");
        } else {
            setDateError("");
        }
    };

    function formatStartDateToString(date){
        let d = new Date(date);
        return d.toISOString().slice(0,19);
    }

    function addEndOfTheDayfunction(date){
        let d =  new Date(date);
         d.setDate(d.getDate() + 1);
         return d.toISOString().slice(0, 19);
    }

    //Count Pending Orders
    function countPendingOrders(){
        return fetchedData.filter(order => order.status === "Pending").length;
    }

    //Count Shipped Orders
    function countShippedOrders(){
        return fetchedData.filter(order => order.status === "Shipped").length;
    }

    //Count Delivered Orders
    function countDeliveredOrders(){
        return fetchedData.filter(order => order.status === "Delivered").length;
    }



    //To get most ordering productid
    function groupOrdersByProductId() {
        console.log("Fetched Data:", fetchedData);  // Check if the data exists

        if (fetchedData.length === 0) {
            console.log("No data to group");
            return;
        }

        const groupedData = fetchedData.reduce((acc, order) => {
            console.log("Order:", order);  // Check the structure of each order

            const { productId } = order;  // Make sure 'productId' exists

            if (!productId) {
                console.log("No productId in order", order);
                return acc;
            }

            // If the productId doesn't exist in the accumulator, create a new array for it
            if (!acc[productId]) {
                acc[productId] = [];
            }

            // Add the order to the corresponding productId group
            acc[productId].push(order);
            return acc;
        }, {});

        // Now, calculate the count of orders for each productId
        const productCounts = Object.keys(groupedData).map(productId => ({
            productId: productId,
            orderCount: groupedData[productId].length,  // Count the number of orders for each productId
        }));

        console.log("Product Counts:", productCounts);  // Check the order counts for each productId

        // Find the productId with the maximum order count
        const maxProduct = productCounts.reduce((max, product) => {
            if (!max || product.orderCount > max.orderCount) {
                return product;
            }
            return max;
        }, null);

        console.log("Product with Maximum Orders:", maxProduct);  // Check the product with maximum orders

        // Optionally, set the max product to state if needed
        // setMaxProduct(maxProduct); // You can store it in state if you need to display it later

        setMostOrderingItem(maxProduct);

    }






    function groupOrdersByUserId() {
        console.log("Fetched Data:", fetchedData);  // Check if the data exists
    
        if (fetchedData.length === 0) {
            console.log("No data to group");
            return;
        }
    
        const groupedData = fetchedData.reduce((acc, order) => {
            console.log("Order:", order);  // Check the structure of each order
    
            const { userId } = order;  // Make sure 'userId' exists
    
            if (!userId) {
                console.log("No userId in order", order);
                return acc;
            }
    
            // If the userId doesn't exist in the accumulator, create a new array for it
            if (!acc[userId]) {
                acc[userId] = [];
            }
    
            // Add the order to the corresponding userId group
            acc[userId].push(order);
            return acc;
        }, {});
    
        // Now, calculate the count of orders for each userId
        const userCounts = Object.keys(groupedData).map(userId => ({
            userId: userId,
            orderCount: groupedData[userId].length,  // Count the number of orders for each userId
        }));
    
        console.log("User Counts:", userCounts);  // Check the order counts for each userId
    
        // Find the userId with the maximum order count
        const maxUser = userCounts.reduce((max, user) => {
            if (!max || user.orderCount > max.orderCount) {
                return user;
            }
            return max;
        }, null);
    
        console.log("User with Maximum Orders:", maxUser);  // Check the user with maximum orders
    
        // Optionally, set the max user to state if needed
        setMostOrderingUser(maxUser);  // Store the user with the maximum order count
    }
    





    function getReport(){

        const formattedStartDate = formatStartDateToString(StartingDate);
        console.log(formattedStartDate);
        const formattedEndDate = addEndOfTheDayfunction(EndingDate);
        console.log(formattedEndDate);

        axios.get(`http://localhost:8080/api/orders/getDataBetweenTwoDays/${formattedStartDate}/${formattedEndDate}`).then((res) => {
            setFetchedData(res.data);
            console.log(res.data);

        })

        
    }

    const chartData = {
        labels: ['Pending', 'Shipped', 'Delivered'],
        datasets: [
            {
                label: 'Order Status',
                data: [countPendingOrders(), countShippedOrders(), countDeliveredOrders()],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    // Bar chart options
    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // This will ensure that only whole numbers are shown on the y-axis
                    precision: 0, // This prevents decimal points (like 0.5) from appearing
                },
            },
        },
    };

    const downloadPDF = async () => {
        if (!StartingDate || !EndingDate) {
          alert("Please select both start and end dates");
          return;
        }
      
        try {
          // 1. First fetch the data
          const formattedStartDate = formatStartDateToString(StartingDate);
          const formattedEndDate = addEndOfTheDayfunction(EndingDate);
          
          const response = await axios.get(
            `http://localhost:8080/api/orders/getDataBetweenTwoDays/${formattedStartDate}/${formattedEndDate}`
          );
          
          // 2. Process the data immediately (no state updates)
          const data = response.data;
          
          // Find most ordered product
          const productCounts = data.reduce((acc, order) => {
            acc[order.productId] = (acc[order.productId] || 0) + 1;
            return acc;
          }, {});
      
          const mostOrderingItem = Object.entries(productCounts).reduce((max, [productId, count]) => {
            return count > max.count ? { productId, count } : max;
          }, { productId: null, count: 0 });
      
          // Find most active user
          const userCounts = data.reduce((acc, order) => {
            acc[order.userId] = (acc[order.userId] || 0) + 1;
            return acc;
          }, {});
      
          const mostOrderingUser = Object.entries(userCounts).reduce((max, [userId, count]) => {
            return count > max.count ? { userId, count } : max;
          }, { userId: null, count: 0 });
      
          // 3. Update state (for UI) and generate PDF
          setFetchedData(data);
          setMostOrderingItem(mostOrderingItem);
          setMostOrderingUser(mostOrderingUser);
      
          // 4. Wait for next render cycle to ensure chart updates
          await new Promise(resolve => setTimeout(resolve, 50));
      
          // 5. Generate PDF
          const pdf = new jsPDF('l', 'mm', 'a4');
          const pageWidth = pdf.internal.pageSize.getWidth();
          
          // Add header
          const logoWidth = 50;
          const logoX = (pageWidth - logoWidth) / 2;
          pdf.addImage(Farmsenselogo, 'PNG', logoX, 10, logoWidth, 20);
          
          // Add title
          pdf.setFontSize(16);
          pdf.text("Order Report", pageWidth / 2, 40, { align: 'center' });
      
          // Add chart (centered)
          const chartCanvas = await html2canvas(chartRef.current, { scale: 2 });
          const chartWidth = 180;
          const chartX = (pageWidth - chartWidth) / 2;
          pdf.addImage(chartCanvas, 'PNG', chartX, 50, chartWidth, 90);
      
          // Add summary
          pdf.setFontSize(10);
          const summaryY = 150;
          pdf.text(`• Total Orders: ${data.length}`, 20, summaryY);
          pdf.text(`• Most Ordered Item: ${mostOrderingItem.productId || 'N/A'}`, 20, summaryY + 5);
          pdf.text(`• Most Active User: ${mostOrderingUser.userId || 'N/A'}`, 20, summaryY + 10);
      
          // Add table
          autoTable(pdf, {
            startY: summaryY + 20,
            head: [['Order ID', 'Product ID', 'User ID', 'Status', 'Order Date', 'Order Time']],
            body: data.map(order => [
              order.orderId,
              order.productId,
              order.userId,
              order.status,
              new Date(order.orderDateTime).toLocaleDateString(),
              new Date(order.orderDateTime).toLocaleTimeString()
            ]),
            styles: { fontSize: 8 }
          });
      
          pdf.save('Order Summary.pdf');
        } catch (error) {
          console.error("Error:", error);
          alert("Report generation failed");
        }
      };

      
    
    

  return (
    <div>
       
        {/* Header with All orders button */}
    <div className="flex justify-end items-center mb-6 mt-5 mr-5">
        {/* All ordersd Button */}
        <Link to="/sellerhome">
            <button className="bg-gray-800 text-white flex items-center py-2 px-4 rounded-lg hover:bg-gray-900">
                <img src={allorders} alt="Report" className="w-5 h-5 mr-2" />
                All Orders
            </button>
        </Link>
    </div>
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto mt-20 " style={{ marginTop: '100px'  , marginBottom : '150px'}} >
        {/* Start Date Input */}
        <div className="mb-4">
                <label className="block text-lg font-semibold mb-2 text-gray-700">Start Date</label>
                <input
                    type="date"
                    value={StartingDate}
                    onChange={handleStartDateChange}
                    max={EndingDate || new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        StartingDate && EndingDate && StartingDate > EndingDate
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-indigo-500"
                    }`}
                />
            </div>

        
            {/* End Date Input */}
            <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-700">End Date</label>
            <input
                type="date"
                value={EndingDate}
                onChange={handleEndDateChange}
                min={StartingDate}
                max={new Date().toLocaleDateString('en-CA')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            </div>

        <button
            onClick={downloadPDF}
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            Download Report
        </button>

        <div
            ref={chartRef}
            style={{ position: "absolute", top: "-10000px", left: "-10000px" }}
        >
            <Bar data={chartData} options={chartOptions} />
        </div>
    </div>
    
    </div>
  )
}

export default ReportGeneration