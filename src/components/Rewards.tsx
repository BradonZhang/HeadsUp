import React, { useState, useEffect, FunctionComponent } from 'react';
import { ListItem } from 'react-native-elements';
import { View } from 'react-native';

import { db } from 'res/firebase';

const Rewards: FunctionComponent = (props) => {
  const [rewardsAvailable, setRewardsAvailable] = useState<Array<any>>([]);
  useEffect(() => {
    let re: Array<any> = [];
    db.collection("rewards").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        re.push(doc.data());
      });
      setRewardsAvailable(re);
    });
  }, []);
  return (
    <View>
      {
        rewardsAvailable.map((doc, index) => (
          <ListItem
            key={String(index)}
            title={doc.name}
            subtitle={`$${doc.value}`}
            rightSubtitle={`${doc.points} points`}
          />
        ))
      }
    </View>
  );
}

export default Rewards;