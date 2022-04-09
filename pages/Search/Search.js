import React, {useEffect, useMemo, useState, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, SectionList, SafeAreaView, Image, ScrollView, TextView  } from 'react-native';

import APIService from '../../services/API.service';

import Pokemon from '../Pokemon/Pokemon';

const Item = ({ name }) => (
	<View style={styles.item}>
	  <Text style={styles.name}>{name}</Text>
	</View>
);

const Search = () => {

	const cardHeight = 65;
    const pageCardScroll = 10;

	const searchResult = useRef(null);
    const searchResultID = useRef(0);

	const [id, setId] = useState(1);

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

	const listenScrollEvent = (ele) => {
        let idScroll = Math.floor(ele.nativeEvent.contentOffset.y / (cardHeight*pageCardScroll));
		console.log(idScroll)
        if (idScroll < searchResultID.current) return;
        searchResultID.current = idScroll;
        setPokemonListFilter([...pokemonListFilter, ...currentPokemonListFilter.current.slice(idScroll*pageCardScroll, idScroll*pageCardScroll+pageCardScroll)])
    }

	const getInfoPoke = (value) => {
		console.log(value)
        const id = parseInt(value.currentTarget.dataset.id);
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
			onBlur={ () => setShowResult(false) }
    		onFocus={ () => setShowResult(true) }/>
			{showResult &&
				<ScrollView style={styles.container} ref={searchResult}
				onScroll={listenScrollEvent.bind(this)}>
					{pokemonListFilter.map((item, index) => (
						<Text key={index} style={styles.item} onTouchStart={(value) => getInfoPoke(value)} value={item.id}>
							<Text>
								<Text style={styles.id}>#{item.id} </Text>
								<Image
									style={styles.tinyLogo}
									source={{uri: item.sprites, width: 36, height: 36}}
								/>
								<Text style={styles.name}> {item.name}</Text>
							</Text>
						</Text>
					))
					}
				</ScrollView >
			}
			<Pokemon id={id} onSetIDPoke={setIDPoke}/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		marginHorizontal: 16,
		height: 330,
		overflow: 'scroll'
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
