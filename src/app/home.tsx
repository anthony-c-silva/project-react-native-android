import { useEffect, useState } from "react";
import {View, Text, Alert} from "react-native"
import MapView, {Callout, Marker} from "react-native-maps"
import {api} from "@/services/api"
import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";
import * as Location from "expo-location"

type MarketsProps = PlaceProps & {}

const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494,
}

export default function Home(){
    const [categories, setCategories] = useState<CategoriesProps>([])
    const [category, setCategory] = useState("")
    const [markets, setMarkets] = useState<MarketsProps[]>([])

    async function featCategories() {
        try{
            const {data} = await api.get("/categories")
            setCategories(data);
            setCategory(data[0].id);
        } catch(error){
            console.log(error);
            Alert.alert("Categorias", "Não foi possivel carregar as categorias")
        }
    }

    async function fetchMarkets() {
        try{
            if(!category){
                return
            }
            const {data} = await api.get("/markets/category/" + category);
            setMarkets(data);

        }catch(error){
            console.log(error);
            Alert.alert("Locais", "Não foi possível carregar os locais.");
        }
    }
    // Pega o endereço correto atual 
    async function getCurrentLocation() {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync()
            if(granted){
               const location = await Location.getCurrentPositionAsync({})
            }
        }catch (error){
            console.log(error)
        }
    }

    useEffect(() =>{
        featCategories()
    }, [])

    useEffect(() =>{
        fetchMarkets()
    },[category])

    return <View style={{flex: 1}}>

        <Categories data={categories} onSelect={setCategory} selected={category}/>
        <MapView style={{flex: 1 }}
            initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }}
        >
            <Marker 
                identifier="current"
                coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                }}
                image={require("@/assets/location.png")}
            />
        </MapView>
        <Places data={markets}/>
    </View>
}