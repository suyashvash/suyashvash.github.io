
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Linking } from "react-native";

export default function JobCard({ firstname, lastName, mail, message, sentTime }) {

  const mailSubject = "Website/App Development";
  const body = `Hi ${firstname},\n I got your form submission .I would love to hear more about 
  this wonderful oppurtunity. Lets discuss the project !\n\nRegards\nSuyash Vashishtha\n`;


  return (
    <View style={styles.cardBody}>
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{firstname + " " + lastName}</Text>
        <Text >{mail}</Text>
        <Text >{sentTime}</Text>
        <Text style={styles.msg}> "{message}"{" "}</Text>
      </View>
      <View style={styles.cardactions}>
        <TouchableOpacity style={styles.statusbutton} onPress={() => Linking.openURL(`mailto:${mail}?subject=${mailSubject}&body=${body}`)}>
          <Text style={styles.statusText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBody: {
    width: "95%",
    padding: 10,
    backgroundColor: "whitesmoke",
    borderRadius: 10,
    margin: 10,
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 12,
  },

  cardactions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    alignSelf: "flex-end",
  },
  name: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  msg: {
    color: "grey",
    fontStyle: "italic",
    padding: 20,
    paddingLeft: 0,
  },

  statusbutton: {
    padding: 10,
    backgroundColor: "black",
    borderRadius: 10,
    marginHorizontal: 10,
  },

  statusText: {
    color: "white",
  },
});
