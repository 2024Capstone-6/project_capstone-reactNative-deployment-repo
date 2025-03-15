import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ENV } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BookmarkModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({ isVisible, onClose }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/30">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white h-[45%] rounded-t-xl p-4">
              {!showCreateForm ? (
                <TouchableOpacity
                  className="flex-row items-center border-2 border-[#ff6b6b] rounded-xl p-1"
                  onPress={() => setShowCreateForm(true)}
                >
                  <Ionicons name="add-circle-outline" size={24} color={Colors.tint} />
                  <Text className="ml-2 text-[#ff6b6b]">새로운 폴더 생성하기</Text>
                </TouchableOpacity>
              ) : (
                <View className="border-2 border-[#ff6b6b] rounded-xl p-3">
                  <TextInput
                    className="border-b border-gray-300 p-2 mb-3"
                    placeholder="폴더 이름을 입력하세요"
                    value={newBookTitle}
                    onChangeText={setNewBookTitle}
                  />
                  <View className="flex-row justify-end space-x-2">
                    <TouchableOpacity
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onPress={() => {
                        setShowCreateForm(false);
                        setNewBookTitle('');
                      }}
                    >
                      <Text>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="px-4 py-2 bg-[#ff6b6b] rounded-lg"
                      onPress={() => {
                        console.log('newBookTitle:', newBookTitle);
                      }}
                      disabled={isCreating || !newBookTitle.trim()}
                    >
                      <Text className="text-white">생성하기</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View className="flex-row items-center justify-between"></View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
