import { useElements, useStripe } from "@stripe/react-stripe-js";
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import { validateShipping } from '../Cart/Shipping';
import { createOrder } from '../../actions/orderActions';
import { clearError as clearOrderError } from "../../slices/orderSlice";

export default function Payment() {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo')) || {};
    const { user } = useSelector(state => state.authState);
    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState);
    const { error: orderError } = useSelector(state => state.orderState);

    useEffect(() => {
        if (!orderInfo || !orderInfo.totalPrice) {
            navigate('/order/success'); 
            return; 
        }

        validateShipping(shippingInfo, navigate);
        
        if (orderError) {
            toast(orderError, {
                position:'bottom-center',
                type: 'error',
                onOpen: () => { dispatch(clearOrderError()); }
            });
        }
    }, [orderError, dispatch, shippingInfo, navigate, orderInfo]);

    if (!orderInfo || !orderInfo.totalPrice) {
        return <h1>Loading...</h1>;
    }

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
        shipping: {
            name: user.name,
            address: {
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1: shippingInfo.address
            },
            phone: shippingInfo.phoneNo
        }
    };

    const order = {
        orderItems: cartItems,
        shippingInfo
    };

    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice;
        order.shippingPrice = orderInfo.shippingPrice;
        order.taxPrice = orderInfo.taxPrice;
        order.totalPrice = orderInfo.totalPrice;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;

        try {
            const { data } = await axios.post('/api/v1/payment/process', paymentData);
            const clientSecret = data.client_secret;
            
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

            if(result.error) {
                toast(result.error.message, { type: 'error',position:'bottom-center' });
                document.querySelector('#pay_btn').disabled = false;
            } else {
                if(result.paymentIntent.status === 'succeeded') {
                    toast('Payment Success!', { type: 'success',position:'bottom-center' });

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    };

                    dispatch(orderCompleted());
                    dispatch(createOrder(order));
                    navigate('/order/success');
                } else {
                    toast('Please Try again!', { type: 'warning', position:'bottom-center' });
                }
            }
        } catch (error) {
            toast('An error occurred',
          { type: 'error',
            position:'bottom-center'});
        }
    };

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-4">Card Info</h1>

                    <div className="form-group">
                        <label htmlFor="card_num_field">Card Number</label>
                        <CardNumberElement id="card_num_field" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="card_exp_field">Card Expiry</label>
                        <CardExpiryElement id="card_exp_field" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="card_cvc_field">Card CVC</label>
                        <CardCvcElement id="card_cvc_field" className="form-control" />
                    </div>

                    <button
                        id="pay_btn"
                        type="submit"
                        className="btn btn-block py-3"
                    >
                        Pay = { `₹ ${orderInfo?.totalPrice || 0}` }
                    </button> 
                </form>
            </div>
        </div>
    );
}
