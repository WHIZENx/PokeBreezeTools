import React from 'react';
import { View, Text, Image } from 'react-native';
import APIService from '../../services/API.service'

// import './Form.css';

const Form = (props) => {

    const calculateRatio = (sex, ratio) => {
        let maleRatio = ratio.M;
        let femaleRatio = ratio.F;
        return (sex.toLowerCase() === 'male') ? maleRatio*100 : femaleRatio*100;
    }

    return (
        <View>
            <View>
                <Image source={{uri: APIService.getGenderSprite(props.sex), width: 40, height: 40}}/>
                { props.ratio ? <Text>{props.sex} ratio: {calculateRatio(props.sex, props.ratio)}%</Text>
                :   <Text>{props.sex} ratio: 100%</Text>}
            </View>
            <View>
                <View>
                    <Image source={{uri: (props.sex.toLowerCase() === 'male') ?
                        (props.default_m) ? props.default_m : props.default_f ? props.default_f : APIService.getPokeSprite(0) :
                        (props.default_f) ? props.default_f : props.default_m ? props.default_m : APIService.getPokeSprite(0), width: 96, height: 96}}/>

                </View>
                <Text>Original form</Text>
                <View>
                    <Image source={{uri: (props.sex.toLowerCase() === 'male') ?
                        (props.shiny_m) ? props.shiny_m : props.shiny_f ? props.shiny_f : APIService.getPokeSprite(0) :
                        (props.shiny_f) ? props.shiny_f : props.shiny_m ? props.shiny_m : APIService.getPokeSprite(0), width: 96, height: 96}}/>
                </View>
                <Text>Shiny form</Text>
            </View>
        </View>
    );
}

export default Form;