import React,{Component} from 'react';
import classes from './BurgerIngredient.css';
import Proptypes from 'prop-types';

class BurgerIngredient extends Component{
  render(){
    //we will add some logic, we will render different things depending on the props we get
    let ingredient = null;
    //type is a prop we will receive
    switch(this.props.type){
      case('bread-bottom'):
        ingredient = <div className={classes.BreadBottom}></div>;
        break;
      case('bread-top'):
        ingredient = (
          //we need to add seeds so we 
        <div className={classes.BreadTop}>
          <div className={classes.Seeds1}></div>
          <div className={classes.Seeds2}></div>
        </div>) ;
        break;
      case('meat'):
        ingredient = <div className={classes.Meat}></div>;
        break;
      case('cheese'):
        ingredient =  <div className={classes.Cheese}></div>;
        break;
      case('salad'):
        ingredient =  <div className={classes.Salad}></div>;
        break;
      case('bacon'):
        ingredient =  <div className={classes.Bacon}></div>;
        break;
    //let's set up a default case ,in case something incorrect is passed in:
    default:
        ingredient = null;
    }
    return ingredient;
  }
}

BurgerIngredient.proptypes = {
  //If we every try to use the ingredient comp without passing a type we get an error,bc of isRequired
  type:Proptypes.string.isRequired
}

export default BurgerIngredient;