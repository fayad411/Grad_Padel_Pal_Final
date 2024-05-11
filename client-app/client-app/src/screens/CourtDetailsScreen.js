import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';

export default function Courtdetails({ token, locationName, company_id, company_name, onBackToCompany ,  role}) {
  const [dates, setDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0); 
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courts, setCourts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const times = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
  const [price, setPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [coachPrice, setCoachPrice] = useState("");
  const [max_capacity , setMax_capacity] = useState("");
  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const generatedDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        generatedDates.push({
          dayName: dayNames[date.getDay()],
          dayNumber: date.getDate(),
        });
      }
      setDates(generatedDates);
    };

    generateDates();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    
    try {
      const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };
      const body = {
        location: locationName,
        _id: company_id
      };
      const response = await axios.post('http://192.168.0.104:3000/company/courts/location/all', body, { headers });
      
      const courts = response.data.map((court) => ({
        _id: court.court._id,
        name: court.court.name,
        price: court.court.price,
        reservations: court.reservations,
      }));
      setCourts(courts);
      console.log('Courts:', courts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
    console.log('newRole:', role);
  }, []);

  const goToPreviousCourt = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setSelectedTimeSlots([]);

  };

  const goToNextCourt = () => {
    if (currentIndex < courts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setSelectedTimeSlots([]);
  };

  const handleSelectDay = (index) => {
    setSelectedDay(index);
    setSelectedTimeSlots([]);
  };

  const handleSelectTimeSlot = (index) => {
    if (
      selectedTimeSlots.length === 0 ||
      Math.abs(selectedTimeSlots[selectedTimeSlots.length - 1] - index) === 1
    ) {
      if (selectedTimeSlots.includes(index)) {
        const deselectedIndex = selectedTimeSlots.indexOf(index);
        setSelectedTimeSlots(selectedTimeSlots.slice(0, deselectedIndex));
      } else {
        if (selectedTimeSlots.length > 0) {
          const nextIndex = selectedTimeSlots[selectedTimeSlots.length - 1] + 1;
          setSelectedTimeSlots([...selectedTimeSlots, nextIndex]);
        }
        setSelectedTimeSlots([...selectedTimeSlots, index]);
      }
    }
  };
  const handleReservation = () => {
    // Calculate total price
    const selectedCourt = courts[currentIndex];
    const totalPrice = selectedCourt.price * selectedTimeSlots.length;
    setPrice(totalPrice);
    // Show confirmation modal
    setShowConfirmation(true);
  };
  const cancelReservation = () => {
    // Close modal and reset state
    setShowConfirmation(false);
    setPrice(0);
  };
  const confirmReservation = () => {
    setLoading(true);
    const selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + selectedDay);
    selectedDate.setHours(0, 0, 0, 0);
  
    const selectedTimes = selectedTimeSlots.map((index) => times[index]);

    const selectedCourt = courts[currentIndex];

    const selectedLocation = locationName;
    const selectedCompany = company_name;
    const startingTime = new Date(selectedDate);
    startingTime.setHours(Number(selectedTimes[0].split(':')[0]), Number(selectedTimes[0].split(':')[1]));
    const endingTime = new Date(selectedDate);
    endingTime.setHours(Number(selectedTimes[selectedTimes.length - 1].split(':')[0]), Number(selectedTimes[selectedTimes.length - 1].split(':')[1]));
  
    console.log('Reservation:', {
      startingTime,
      endingTime,
      court: selectedCourt,
      location: selectedLocation,
      company: selectedCompany,
    });
    console.log(selectedCourt);
    console.log('role:', role);
    var priceint = parseInt(coachPrice);
    var max_capacityint = parseInt(max_capacity);

    const body = role === 'coach' ? {
      startingTime,
      endingTime,
      court_id: selectedCourt._id,
      location: selectedLocation,
      price: priceint,
      max_capacity : max_capacityint
    } : {
      startingTime,
      endingTime,
      court_id: selectedCourt._id,
      location: selectedLocation,
    };


    
    axios.post('http://192.168.0.104:3000/company/reserve/court', body, { headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` } })
      .then((response) => {
        console.log('Reservation response:', response.data);
        setShowConfirmation(false);
        setLoading(false);
        
        fetchData();
      })
      .catch((error) => {
        console.error('Error reserving court:', error.data);
      });
  }
  return (
    loading ? (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    ) : 
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToCompany}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.companyName}>{company_name}</Text>
      </View>
      <View style={styles.dateNav}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dateButton, selectedDay === index && styles.selectedDateButton]}
            onPress={() => handleSelectDay(index)}
          >
            <Text style={[styles.dayName, selectedDay === index && styles.selectedDayName]}>{date.dayName}</Text>
            <Text style={[styles.dayNumber, selectedDay === index && styles.selectedDayNumber]}>{date.dayNumber}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.courtNavigation}>
        <TouchableOpacity onPress={goToPreviousCourt}>
          <Text style={styles.navigationButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.currentCourt}>{courts[currentIndex]?.name}</Text>
        <TouchableOpacity onPress={goToNextCourt}>
          <Text style={styles.navigationButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      {/* Render current court */}
      {courts != [] && (
          <View style={styles.courtContainer}>
            
            <Text style={styles.courtName}>Price: ${courts[currentIndex]?.price}</Text>
            <TouchableOpacity
              style={[styles.reserveButton, selectedTimeSlots.length === 0 && styles.disabledButton]}
              onPress={handleReservation}
              disabled={selectedTimeSlots.length === 0}
            >
              <Text style={styles.reserveButtonText}>Reserve</Text>
            </TouchableOpacity>
            {times.map((time, index) => {
              const court = courts[currentIndex];
              if (!court || !court.reservations) return null;

              const isDisabled = court.reservations.some(reservation => {
                const reservationDate = new Date(reservation.startingTime);
          
                var currentTime = new Date();
                currentTime.setHours(Number(time.split(':')[0]), Number(time.split(':')[1]), 0, 0);
                var selectedDate = new Date();
                currentTime.setDate(currentTime.getDate() + selectedDay);
                selectedDate.setDate(selectedDate.getDate() + selectedDay);
                selectedDate.setHours(0, 0, 0, 0);
                reservationDate.setHours(reservationDate.getHours() );

                const endingTime = new Date(reservation.endingTime);
                endingTime.setHours(endingTime.getHours());

                return selectedDate.getMonth() === reservationDate.getMonth() &&
                        selectedDate.getDate() === reservationDate.getDate() &&
                       currentTime >= reservationDate &&
                       currentTime <= endingTime;
              });

              return (
              isDisabled?
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: 'red',
                }}
                onPress={() => handleSelectTimeSlot(index)}
                disabled={isDisabled}
              >
                <Text style={[styles.timeCell ,
                  {
                   backgroundColor: 'red',
                  }
                
                ]}>{time}</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                key={index}
                style={[styles.timeRow, selectedTimeSlots.includes(index) && styles.selectedTimeSlot]}
                onPress={() => handleSelectTimeSlot(index)}
              >
                
                <Text style={styles.timeCell}>{time}</Text>
              </TouchableOpacity>
              );
            })}
          </View>
        )
        }
        <Modal
        visible={showConfirmation}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Reservation</Text>
            <Text style={styles.modalText}>Selected Time Slots:</Text>
            <View style={styles.selectedSlotsContainer}>
              {selectedTimeSlots.map((index) => (
                <Text key={index} style={styles.selectedSlotText}>{times[index]}</Text>
              ))}
            </View>
            
            {role === 'coach' && (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Price per hour"
                    value={coachPrice.toString()} 
                    onChangeText={value => setCoachPrice(value.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Max Capacity"
                    value={max_capacity.toString()} 
                    onChangeText={value => setMax_capacity(value.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                  />
                </View>
              )}
            <Text style={styles.modalText}>Total Price: ${price}</Text>
            <View style={styles.modalButtons}>
              <Button title="Confirm" onPress={confirmReservation} />
              <Button title="Cancel" onPress={cancelReservation} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  selectedSlotText: {
    fontSize: 16,
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#d9d9d9',
    padding: 5,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  reserveButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#c0c0c0',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 15,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginRight: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  dateNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  dateButton: {
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
  },
  selectedDateButton: {
    borderWidth: 2,
    borderColor: 'black',
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedDayName: {
    color: 'black',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  selectedDayNumber: {
    color: 'black',
  },
  courtContainer: {
    margin: 10,
    padding: 10,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    alignSelf: 'center',
    
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'transparent',
  },
  timeCell: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#d9d9d9',
    textAlign: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#fff',
    borderColor: 'black',
  },
  disabledTimeSlot: {
    backgroundColor: '#c0c0c0',
  },
  courtNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  navigationButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  currentCourt: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
