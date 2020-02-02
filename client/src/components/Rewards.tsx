import React, { useState, useEffect, FunctionComponent } from 'react';
import { ListItem } from 'react-native-elements';
import { View, FlatList, Alert } from 'react-native';

import { db, functions } from 'res/firebase';

interface RewardsProps {
  email: String;
}

const Rewards: FunctionComponent<RewardsProps> = (props) => {

  const { email } = props;

  const [rewardsAvailable, setRewardsAvailable] = useState<Array<any>>([]);

  useEffect(() => {
    let re: Array<any> = [];
    db.collection("rewards").orderBy('points').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        re.push(doc.data());
      });
      setRewardsAvailable(re);
    });
  }, []);

  const handlePress = async (id: String) => {
    // TODO: Prompt user
    const redeemReward = functions.httpsCallable('redeemReward');
    try {
      const result = await redeemReward({email, id});
      if (result.data && result.data.error) {
        Alert.alert(result.data.error);
      } else {
        Alert.alert('Successfully obtained reward. Check your email!')
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View>
      <FlatList
        data={rewardsAvailable}
        keyExtractor={(doc, index) => String(index)}
        renderItem={({ item: doc, index }) => (
          <ListItem
            title={doc.name}
            subtitle={`$${doc.value} · ${doc.provider}`}
            rightSubtitle={`${doc.points} points`}
            onPress={() => handlePress(doc.id)}
          />
        )}
      />
    </View>
  );
}

export default Rewards;