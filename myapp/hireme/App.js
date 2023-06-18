import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import myPic from "../hireme/assets/myPic.jpg";
import JobCard from "./component/jobCard";
import { projectFirestore } from "./component/firebase/config";
import Logo from './assets/icon.png'

export default function App() {

  const [enquiryList, setEnquiryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => { getEnquiries() }, [refresh]);

  const getEnquiries = () => {
    projectFirestore.collection("enquiries").orderBy('timeStamp', 'desc')
      .onSnapshot((snap) => {
        let documents = [];
        snap.forEach((doc) => { documents.push({ ...doc.data(), id: doc.id }) });
        setEnquiryList(documents);
        setIsLoading(false)
      });
  }

  const EnquiryPanel = () => {
    return (
      enquiryList.length != 0 ?
        enquiryList.map((enquiry, index) =>
          <JobCard
            key={index}
            firstname={enquiry.firstName}
            sentTime={`${new Date(enquiry.sentOn.seconds * 1000)}`}
            lastName={enquiry.lastName} mail={enquiry.email}
            message={enquiry.message} />)
        :
        <Text style={styles.enqText} >No new enquiries right now !</Text>
    )
  }



  return (

    <View style={styles.container}>
      {!isLoading ?
        <ScrollView style={styles.scroller}>
          <View style={styles.scrollWrapper}>
            <View style={styles.header}>
              <Image source={myPic} style={styles.img} />
              <View style={{ justifyContent: "center", alignItems: "flex-start", padding: 20, }}>
                <Text style={styles.devName}>Suyash Vashishtha</Text>
                <Text style={styles.devJob}>Web/App Developer</Text>
              </View>
            </View>
            <View style={[styles.content, enquiryList.length == 0 && { height: 650 }]}>
              <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.contentHead}>Recent</Text>
                <TouchableOpacity onPress={() => setRefresh(!refresh)} style={{ backgroundColor: 'black', borderRadius: 10, padding: 10 }}>
                  <Text style={{ color: 'white' }}>Refresh</Text>
                </TouchableOpacity>
              </View>
              <EnquiryPanel />
            </View>
          </View>
        </ScrollView>
        :
        <View style={styles.container}>
          <Image source={Logo} style={{ width: 150, height: 150 }} />
          <Text style={{ color: 'white', fontSize: 20 }}>Loading enquiries...</Text>
        </View>
      }
      <StatusBar backgroundColor="black" />
    </View >



  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },

  scroller: {
    width: "98%",

    backgroundColor: "black",
  },

  scrollWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",

  },

  header: {
    height: 120,
    justifyContent: "center",
    padding: 20,
    flexDirection: "row",
    marginTop: 40,
    alignSelf: "flex-start",
  },

  img: {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 50,
  },

  devName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  devJob: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },

  content: {
    backgroundColor: "white",
    width: "99%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    alignItems: "center",


  },


  contentHead: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    padding: 20,
    paddingHorizontal: 10,
  },

  enqText: {
    fontSize: 16,
    color: "grey",
    padding: 20,
    width: "100%",
  },

  siteButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 6,
  },
  siteText: {
    fontSize: 14,
  },
});
