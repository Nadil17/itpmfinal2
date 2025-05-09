import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import ReportIcon from '../icons/report_white.png'



function SellerHome() {

    const [confirmOrders , setConfirmOrders] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/orders/getConfirmOrders`).then((res) => {
            console.log(res.data);
            setConfirmOrders(res.data);
        })
    } , [])

    //handle Shipped Button
    const handleShippedButton = (orderId) => {

        const updateToShipped = {
            orderId : orderId,
            status : "Shipped"
        }

        axios.put(`http://localhost:8080/api/orders/updateOrderStatus`, updateToShipped)
        .then((res) => {
            // Update the status locally in the state after successful update
            setConfirmOrders(prevOrders => 
                prevOrders.map(order => 
                    order.orderId === orderId ? { ...order, status: "Shipped" } : order
                )
            );
            console.log(res.data);
        }).catch((err) => {
            console.error(err.message);
        })
    }

    //Handle Delivered Button
    const handleDeliveredButton = (orderId) => {

        const updateToDelivered = {
            orderId : orderId,
            status : "Delivered"
        }

        axios.put(`http://localhost:8080/api/orders/updateOrderStatus`, updateToDelivered)
        .then((res) => {
            // Update the status locally in the state after successful update
            setConfirmOrders(prevOrders => 
                prevOrders.map(order => 
                    order.orderId === orderId ? { ...order, status: "Delivered" } : order
                )
            );
            console.log(res.data);
        }).catch((err) => {
            console.error(err.message);
        })
    }

    //Handle Pending Button
    const handlePendingButton = (orderId) => {

        const updateToPending = {
            orderId : orderId,
            status : "Pending"
        }

        axios.put(`http://localhost:8080/api/orders/updateOrderStatus`, updateToPending)
        .then((res) => {
            // Update the status locally in the state after successful update
            setConfirmOrders(prevOrders => 
                prevOrders.map(order => 
                    order.orderId === orderId ? { ...order, status: "Pending" } : order
                )
            );
            console.log(res.data);
        }).catch((err) => {
            console.error(err.message);
        })
    }

    //Colour for Order Status
    function getStatusColor(status) {
        switch (status) {
            case 'Pending':
            return 'text-yellow-500';  // Text color for Pending
        case 'Shipped':
            return 'text-blue-700';    // Text color for Shipped
        case 'Delivered':
            return 'text-teal-500';    // Text color for Delivered
        case 'Cancelled':
            return 'text-red-500';     // Text color for Cancelled
        default:
            return 'text-gray-400'; 
        }
    }

    

  return (
    <div>
        
    <div className="container mx-auto px-4 py-6">
       
            

            {/* Header with Report Generation button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
                
                {/* Report Generation Button */}
                <Link to="/reportgeneration">
                    <button className="bg-gray-800 text-white flex items-center py-2 px-4 rounded-lg hover:bg-gray-900">
                        <img src={ReportIcon} alt="Report" className="w-5 h-5 mr-2" />
                        Report Generation
                    </button>
                </Link>
            </div>

            {confirmOrders.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Order ID</th>
                                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Product ID</th>
                                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Quantity</th>
                                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Price</th>
                                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Order Date</th>
                                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Current Status</th>
                                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {confirmOrders.map((order, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="px-4 py-2">{order.orderId}</td>
                                    <td className="px-4 py-2">{order.productId}</td>
                                    <td className="px-4 py-2">{order.quantity}</td>
                                    <td className="px-4 py-2 text-green-500 font-semibold">${order.price}</td>
                                    <td className="px-4 py-2">{new Date(order.orderDateTime).toLocaleDateString()}</td>

                                    
                                    {/* Displaying the current status */}
                                    <td className="px-4 py-2 text-center">
                                        <span className={`${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>


                                    {/* Action buttons */}
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handlePendingButton(order.orderId)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-full shadow-md transition duration-300 ease-in-out">
                                                Pending
                                            </button>
                                            <button onClick={() => handleShippedButton(order.orderId)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full shadow-md transition duration-300 ease-in-out">
                                                Shipped
                                            </button>
                                            <button onClick={() => handleDeliveredButton(order.orderId)} className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-full shadow-md transition duration-300 ease-in-out">
                                                Delivered
                                            </button>
                                            
                                            
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">No confirmed orders available.</p>
            )}
            <br></br>

            

        </div>
       
        </div>
  )
}

export default SellerHome