import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger =(props)=>{
  //object.keys willgive us the properties from the object,not the values
  //so we basically extract all the types using this
  //we map the object into an array of ingredients , 
  //where the value of the property is important to decide how many ingredients we need
  //and the key is important to which TYPE of ingredient we need
  let transformedIngredients = Object.keys(props.ingredients)
  .map(igKey =>{
    //this way we return a new array for each property, containing the value
    return [...Array(props.ingredients[igKey])]
    //we don't care about the element itself,that's why we use _ we care about the length
    .map((_,i)=>{
      return <BurgerIngredient key={igKey + i} type={igKey}/>
    })
  })
  .reduce((arr,el)=>{
    //this will take the curr el we are looping and add it to the [] empty initial value array
    return arr.concat(el)
  },[]) ; 
  if(transformedIngredients.length === 0){
    transformedIngredients = <p>Please start adding ingredients</p>
  }
  return(
    <div className={classes.Burger}>
      <BurgerIngredient type={'bread-top'}/>
      {transformedIngredients}
      <BurgerIngredient type={'bread-bottom'}/>
    </div>
  )
}

export default burger;