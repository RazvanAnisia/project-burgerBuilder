import React,{Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES ={
  salad:0.5,
  cheese:0.4,
  meat:1.30 ,
  bacon:0.7
}

class BurgerBuilder extends Component{
  state ={
    ingredients:null,
    totalPrice:4,
    purchasable:false,
    purchasing:false,
    loading:false,
    error:false
  }
  componentDidMount(){
    axios.get('https://react-my-burger-9bd1c.firebaseio.com/ingredients.json ')
    .then(response =>{
      this.setState({ingredients:response.data})
    })
    .catch(err =>{
      this.setState({error:true})
    })
  }
  updatePurchaseState (ingredients){
    
    //this will create an array of strings with the object properties
    const sum = Object.keys(ingredients)
    .map(igKey =>{
      //will create a new array with all the values in the object.
      return ingredients[igKey]
    })
    //add all the values in the array
    .reduce((sum,el)=>{
      return sum + el;
    },0) 
    //change the state to true only of the sum > 0,so if there are ingred.
    this.setState({purchasable:sum > 0})

  };
  addIngredientHandler = (type)=>{
    //update the ingredients
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    //state must be updated immutably
    const updatedIngredients = {...this.state.ingredients};
    //access the ingredient and update the count
    updatedIngredients[type] = updatedCount;

    //update the price
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({
      ingredients:updatedIngredients,
      totalPrice:newPrice 
    })
    
    this.updatePurchaseState(updatedIngredients)
  }
  removeIngredientHandler = (type)=>{
     //update the ingredients
     const oldCount = this.state.ingredients[type];
     if(oldCount <= 0){
       return;
     }
     const updatedCount = oldCount - 1;
     //state must be updated immutably
     const updatedIngredients = {...this.state.ingredients};
     //access the ingredient and update the count
     updatedIngredients[type] = updatedCount;
 
     //update the price
     const priceDeduction = INGREDIENT_PRICES[type];
     const oldPrice = this.state.totalPrice;
     const newPrice = oldPrice -  priceDeduction;
 
     this.setState({
       ingredients:updatedIngredients,
       totalPrice:newPrice 
     })
     this.updatePurchaseState(updatedIngredients)
  }
  purchaseHandler =()=> {
    this.setState({purchasing:true})
  }
  purchaseCancelHandler=()=>{
    this.setState({purchasing:false})
  }
  purchaseContinueHandler=()=>{
    // change the loading to true
    this.setState({loading:true})
    const order= {
      ingredients:this.state.ingredients,
      price:this.state.totalPrice,
      customer:{
        name:'Dodel',
        adress:{
          street:'49 Bakers Street',
          zipCode:'2345',
          country:'Holland'
        },
        email:'dodel@gmail.com' 
      },
      deliveryMethod:'Plane'
    }
    axios.post('/orders.json', order)
    .then(res =>{
      //we want to stop loading no matter what the response 
      this.setState({loading:false, purchasing:false})  
    })
    .catch(err=>{
      //stop the loading even if err
      this.setState({loading:false, purchasing:false})
      }
    )
  }
  render(){
    //create a copy
    const disabledInfo = {...this.state.ingredients};
    for(let key in disabledInfo){
      //we will ckeck if any of the properties are equal or less then 0
      disabledInfo[key] = disabledInfo[key] <= 0;
      //the copy of the object will be updated with true of false
    }
    let orderSummary = null;
    let burger= this.state.error ? <p>Ingredients can't be loaded</p> :<Spinner/>
       
    if(this.state.ingredients){
      burger = (<Aux><Burger ingredients={this.state.ingredients}/>
        <BuildControls 
        ordered={this.purchaseHandler}
        purchasable={this.state.purchasable}
        price={this.state.totalPrice} 
        disabled={disabledInfo}
        ingredientRemoved={this.removeIngredientHandler} 
        ingredientAdded ={this.addIngredientHandler}/></Aux>);
      orderSummary= <OrderSummary 
        price={this.state.totalPrice} 
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        ingredients ={this.state.ingredients}/>;
   
    }
    if(this.state.loading){
      orderSummary=<Spinner/>
    }
    
    return(
      <Aux>
        <Modal modalClosed={this.purchaseCancelHandler} 
        show={this.state.purchasing}>
         {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder,axios);