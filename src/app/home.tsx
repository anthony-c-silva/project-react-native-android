import { useEffect, useState } from "react";
import {View, Text, Alert} from "react-native"

import {api} from "@/services/api"
import { Categories, CategoriesProps } from "@/components/categories";

export default function Home(){
    const [categories, setCategories] = useState<CategoriesProps>([])
    const [category, setCategory] = useState("")

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

    useEffect(() =>{
        featCategories()
    }, [])

    return <View style={{flex: 1}}>
        <Categories data={categories} onSelect={setCategory} selected={category}/>
    </View>
}