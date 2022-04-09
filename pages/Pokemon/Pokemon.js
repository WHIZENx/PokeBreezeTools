import React, {useEffect, useState, useRef, useCallback} from 'react';
import { StyleSheet, Text, View, TextInput, SectionList, SafeAreaView, Image, ScrollView  } from 'react-native';

import APIService from '../../services/API.service';

const Pokemon = (props) => {

    const initialize = useRef(null);

    const [pokeData, setPokeData] = useState([]);
    const [formList, setFormList] = useState([]);

    const [dataPri, setDataPri] = useState(null);

    const [released, setReleased] = useState(null);
    const [typeEffective, setTypeEffective] = useState(null);
    const [weatherEffective, setWeatherEffective] = useState(null);
    const [data, setData] = useState(null);
    const [stats, setStats] = useState(null);
    const [pokeRatio, setPokeRatio] = useState(null);

    const [version, setVersion] = useState(null);

    // const { enqueueSnackbar } = useSnackbar();

    const convertArrStats = (data) => {
        return Object.entries(data).map(([key, value]) => {
            return {id: value.num, name: value.slug, base_stats: value.baseStats,
            baseStatsPokeGo: {attack: calBaseATK(value.baseStats), defense: calBaseDEF(value.baseStats), stamina: calBaseSTA(value.baseStats)}}
        })
    };

    const getRatioGender = useCallback((data, id) => {
        let genderRatio;
        Object.entries(data).forEach(([key, value]) => {
            if (id === value.num) {
                genderRatio = value.genderRatio;
                return;
            };
        });
        return genderRatio;
    }, []);

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const splitAndCapitalize = useCallback((string) => {
        return string.split("-").map(text => capitalize(text)).join(" ");
    }, []);

    const fetchMap = useCallback(async (data) => {
        setFormList([]);
        setPokeData([]);
        let dataPokeList = [];
        let dataFromList = [];
        await Promise.all(data.varieties.map(async (value, index) => {
            const poke_info = await APIService.getFetchUrl(value.pokemon.url);
            // const poke_form = await APIService.getFetchUrl(poke_info.data.forms[0].url);
            const poke_form = await Promise.all(poke_info.data.forms.map(async (item) => (await APIService.getFetchUrl(item.url)).data));
            dataPokeList.push(poke_info.data);
            dataFromList.push(poke_form);
        }));
        setPokeData(dataPokeList);
        dataFromList = dataFromList.map(item => {
            return item.map(item => ({form: item, name: data.varieties.find(v => item.pokemon.name.includes(v.pokemon.name)).pokemon.name, default_name: data.name}))
            .sort((a,b) => (a.form.id > b.form.id) ? 1 : ((b.form.id > a.form.id) ? -1 : 0));
        }).sort((a,b) => (a[0].form.id > b[0].form.id) ? 1 : ((b[0].form.id > a[0].form.id) ? -1 : 0));
        setFormList(dataFromList);
        const defaultFrom = dataFromList.map(item => item.find(item => item.form.is_default));
        const isDefaultForm = defaultFrom.find(item => item.form.id === data.id);
        if (isDefaultForm) setVersion(splitAndCapitalize(isDefaultForm.form.version_group.name));
        else setVersion(splitAndCapitalize(defaultFrom[0].form.version_group.name));
    }, [splitAndCapitalize]);

    const queryPokemon = useCallback((id) => {
        APIService.getPokeSpicies(id)
        .then(res => {
            setPokeRatio(getRatioGender(dataPri, res.data.id));
            fetchMap(res.data);
            setData(res.data);
        })
        .catch(err => {
            // enqueueSnackbar('Pokémon ID or name: ' + id + ' Not found!', { variant: 'error' });
            console.log('Pokémon ID or name: ' + id + ' Not found! ' + err)
        });
    }, [getRatioGender, fetchMap, dataPri]);

    useEffect(() => {
        if (!initialize.current) {
            APIService.getFetchUrl('https://itsjavi.com/pokemon-assets/assets/data/pokemon.json')
            .then(res => {
                setStats(sortStatsPokemon(convertArrStats(res.data)));
                setDataPri(res.data);

                return APIService.getPokeJSON('released_pokemon.json');
            })
            .then(res => {
                setReleased(res.data);
                return APIService.getPokeJSON('type_effectiveness.json');
            })
            .then(res => {
                setTypeEffective(res.data);
                console.log(res.data)
                return APIService.getPokeJSON('weather_boosts.json');
            })
            .then(res => {
                setWeatherEffective(res.data);
            })
            .finally(initialize.current = true);
        } else {
            console.log(dataPri)
            queryPokemon(props.id);
        }
    }, [props.id, queryPokemon]);

    const getNumGen = (url) => {
        return "Gen " + url.split("/")[6]
    }

    const setVersionName = (version) => {
        setVersion(splitAndCapitalize(version));
    }

    return (
        <View>
            <Text>{props.id}</Text>
        </View>
    )
}

export default Pokemon;