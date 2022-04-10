import React, {useEffect, useMemo, useState, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, SectionList, SafeAreaView, Image, ScrollView, TextView, Button, TouchableOpacity, Dropdown  } from 'react-native';

import APIService from '../../services/API.service';

import Pokemon from '../Pokemon/Pokemon';

const Item = ({ name }) => (
	<View style={styles.item}>
	  <Text style={styles.name}>{name}</Text>
	</View>
);

const Search = () => {

	const cardHeight = 67;
    const pageCardScroll = 10;

	const searchResult = useRef(null);
    const searchResultID = useRef(0);

	const [id, setId] = useState(890);

	const pokeList = useMemo(() => {return []}, []);

	const [searchTerm, setSearchTerm] = useState('');
    const [showResult, setShowResult] = useState(false);

	const [pokemonList, setPokemonList] = useState([]);
    const currentPokemonListFilter = useRef([]);
    const [pokemonListFilter, setPokemonListFilter] = useState([]);

	useEffect(() => {
		const fetchMyAPI = async () => {
            if (pokeList.length === 0) {
                const res = await APIService.getPokeJSON('pokemon_names.json');
                Object.entries(res.data).forEach(([key, value]) => {
                    pokeList.push({id: value.id, name: value.name, sprites: APIService.getPokeSprite(value.id)});
                });
				// console.log(res.data)
                setPokemonList(pokeList);
            }
        }
        fetchMyAPI();

		const results = pokemonList.filter(item => item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) || item.id.toString().includes(searchTerm));
        currentPokemonListFilter.current = results;
        setPokemonListFilter(currentPokemonListFilter.current.slice(0, 20));
	}, [searchTerm, pokemonList, pokeList]);

	const getInfoPoke = (value) => {
        const id = parseInt(value.id);
        setShowResult(false);
        setId(id);
    };

	const setIDPoke = (id) => {
        setId(id);
    }

	return (
		<View>
			<Text style={styles.head}>Pokemon Search Infomation</Text>
			<TextInput style={styles.input} placeholder="Enter name or ID"
			value={searchTerm} onChangeText={(value) => setSearchTerm(value)}
			// onBlur={ () => setShowResult(false) }
    		onFocus={ () => setShowResult(true) }/>
			{showResult &&
				<ScrollView style={styles.container}>
					{pokemonListFilter.map((item, index) => (
						<TouchableOpacity key={index} style={styles.item} onPress={() => getInfoPoke(item)}>
							<Text>
								<Text style={styles.id}>#{item.id} </Text>
								<Image source={{uri: item.sprites, width: 36, height: 36}}
								/>
								<Text style={styles.name}> {item.name}</Text>
							</Text>
						</TouchableOpacity>
					))
					}
				</ScrollView >
			}
			<ScrollView>
				<Pokemon id={id} onSetIDPoke={setIDPoke}/>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		marginHorizontal: 16,
		height: 335,
		overflow: 'scroll',
		position: 'absolute',
		left: 0,
		right: 0,
		zIndex: 1,
		backgroundColor: 'white',
		marginTop: 100
	},
	input: {
	  height: 40,
	  marginStart: 16,
	  marginTop: 12,
	  marginEnd: 16,
	  borderWidth: 1,
	  padding: 10,
	},
	head: {
		fontSize: 24,
		textAlign: 'center',
		fontWeight: 'bold',
		marginTop: 15
	},
	item: {
		padding: 10,
		borderBottomWidth: 1,
	},
	id: {
		color: 'black',
		fontSize: 24,
		fontWeight: 'bold',
	},
	name: {
		color: 'black',
		fontSize: 24,
	}
});

export default Search;
