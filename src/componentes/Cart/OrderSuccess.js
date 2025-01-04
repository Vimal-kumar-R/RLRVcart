export default function OrderSuccess(){
    return(
       <div className="row justify-content-center">
          <div className="col-6 mt-5 text-center">
            <img className="my-5 img-fluid d-block mx-auto" src="/images/success.png" alt="image.name" />
              <h2>Your Order has been placed Successfully</h2>
              <a href="/orders">Go to Order</a>
          </div>
       </div> 
    )
}