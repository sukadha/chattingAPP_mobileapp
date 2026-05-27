import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STORES
// ─────────────────────────────────────────────────────────────────────────────

export type Contact = {
  id: string;
  name: string;
  avatarColor: string;
  avatarText: string;
  avatarImage?: string;
  online: boolean;
};

export type CallRecord = {
  id: string;
  contactId: string;
  contactName: string;
  avatarColor: string;
  avatarText: string;
  avatarImage?: string;
  date: string;
  time: string;
  duration?: string;
  callType: 'incoming' | 'outgoing' | 'missed';
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
};

function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next: T) => {
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

function useStore<T>(store: ReturnType<typeof createStore<T>>) {
  const [val, setVal] = useState(store.get());
  useEffect(() => store.subscribe(() => setVal(store.get())), [store]);
  return val;
}

const AVATAR_COLORS = [
  '#22C55E', '#A78BFA', '#FCD34D', '#F87171', '#60A5FA',
  '#34D399', '#FB923C', '#E879F9', '#38BDF8', '#4ADE80',
];

export const contactsStore = createStore<Contact[]>([
  { id: '1', name: 'Mahesh Babu', avatarColor: '#EC4899', avatarText: 'MB', online: true },
  { id: '2', name: 'Arvind', avatarColor: '#22C55E', avatarText: 'A', online: true },
  { id: '3', name: 'Tarun', avatarColor: '#A78BFA', avatarText: 'T', online: true },
  { id: '4', name: 'Lakshmi', avatarColor: '#FCD34D', avatarText: 'L', online: false },
  { id: '5', name: 'Priya', avatarColor: '#9CA3AF', avatarText: 'P', online: true },
]);

export const callsStore = createStore<CallRecord[]>([]);

export const conversationsStore = createStore<Record<string, ChatMessage[]>>({
  '1': [
    {
      id: 'm1',
      role: 'assistant',
      text: "Hi Alex! Have you had a chance to look at the project proposal I sent over yesterday?",
      time: '10:42 AM',
    },
    {
      id: 'm2',
      role: 'user',
      text: "Hey Priya! Yes, I just finished reviewing it. The layout looks fantastic, especially the bento grid section.",
      time: '10:45 AM',
    },
    {
      id: 'm3',
      role: 'user',
      text: "I have a few small suggestions for the color palette, but overall it's exactly what we need.",
      time: '10:46 AM',
    },
    {
      id: 'm4',
      role: 'assistant',
      text: "That's great to hear! Was this the part you were talking about?",
      time: '10:48 AM',
    },
  ],
});

// Natural conversation AI responses
function getNaturalReply(userMessage: string, contactName: string): string {
  const lowerMsg = userMessage.toLowerCase();
  
  // Greetings
  if (lowerMsg.match(/^(hi|hello|hey|hola|sup)/)) {
    const greetings = [
      `Hey! How's it going?`,
      `Hi there! What are you up to?`,
      `Hello! What's new with you?`,
      `Hey! Studying right now, what about you?`,
      `Hi! Just working on some stuff, you?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // How are you
  if (lowerMsg.includes('how are you') || lowerMsg.includes('how\'s it going')) {
    const responses = [
      `I'm doing great, thanks for asking! Just staying busy with work. You?`,
      `Pretty good! Just finished up a meeting. What about you?`,
      `Doing well! A bit tired but pushing through. How's your day?`,
      `All good here! Just chilling. What are you up to?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // What are you doing
  if (lowerMsg.includes('what are you doing') || lowerMsg.includes('whatcha doing') || lowerMsg.includes('what\'s up')) {
    const activities = [
      `Just studying for my exam tomorrow. It's so much material! 😅`,
      `Working on that project we discussed. Almost done with it!`,
      `Watching some tutorials to learn React Native. Pretty interesting stuff!`,
      `Just finished my workout. Feeling great! What about you?`,
      `Studying for the certification test. It's intense but I'm getting there!`,
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }
  
  // Project/work related
  if (lowerMsg.includes('project') || lowerMsg.includes('work') || lowerMsg.includes('task')) {
    const projectReplies = [
      `The project is coming along great! I've made significant progress on the frontend.`,
      `Just pushed some updates to the repository. Can you review them when you get a chance?`,
      `I think we're on track to meet the deadline. The team has been doing amazing work!`,
      `Had a few challenges with the API integration, but I think I figured it out.`,
    ];
    return projectReplies[Math.floor(Math.random() * projectReplies.length)];
  }
  
  // Study/learning
  if (lowerMsg.includes('study') || lowerMsg.includes('learn') || lowerMsg.includes('course')) {
    const studyReplies = [
      `Yeah, studying for the React exam. There's so much to remember!`,
      `Just finished a chapter on TypeScript. It's really clicking now!`,
      `Taking a break from studying. My brain needs a rest lol`,
      `The course is great! Learning a lot about mobile development.`,
    ];
    return studyReplies[Math.floor(Math.random() * studyReplies.length)];
  }
  
  // Questions about the user
  if (lowerMsg.includes('you') && (lowerMsg.includes('do') || lowerMsg.includes('think'))) {
    const thoughtfulReplies = [
      `I think that's a great idea! We should definitely move forward with it.`,
      `Honestly, I'm not sure. Let me think about it and get back to you.`,
      `That sounds interesting! Tell me more about what you have in mind.`,
      `I was just thinking the same thing! Great minds think alike.`,
    ];
    return thoughtfulReplies[Math.floor(Math.random() * thoughtfulReplies.length)];
  }
  
  // Thanks/Appreciation
  if (lowerMsg.includes('thank') || lowerMsg.includes('thanks') || lowerMsg.includes('appreciate')) {
    return `You're very welcome! Always happy to help out. 😊`;
  }
  
  // Goodbye
  if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye') || lowerMsg.includes('see you')) {
    const goodbyes = [
      `Bye! Talk to you later 👋`,
      `See you soon! Take care!`,
      `Catch you later! Have a good one!`,
    ];
    return goodbyes[Math.floor(Math.random() * goodbyes.length)];
  }
  
  // Meeting/Call
  if (lowerMsg.includes('meeting') || lowerMsg.includes('call') || lowerMsg.includes('schedule')) {
    return `Sure! I'm free later this afternoon. What time works for you?`;
  }
  
  // Default friendly responses
  const defaultResponses = [
    `That sounds interesting! Tell me more about it.`,
    `I see what you mean. Let me think about that for a moment.`,
    `Thanks for letting me know! I'll keep that in mind.`,
    `Hmm, that's a good point. I hadn't thought about it that way.`,
    `Interesting! What makes you say that?`,
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Simulate typing delay
async function sendWithTyping(
  contactName: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getNaturalReply(userMessage, contactName));
    }, 800 + Math.random() * 1000);
  });
}

function Avatar({ contact, size = 50, showOnline = true }: { 
  contact: Contact; 
  size?: number; 
  showOnline?: boolean;
}) {
  const dotSize = size * 0.24;
  return (
    <View style={{ position: 'relative', marginRight: 14 }}>
      {contact.avatarImage ? (
        <Image
          source={{ uri: contact.avatarImage }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: contact.avatarColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: size * 0.3, fontWeight: '700' }}>
            {contact.avatarText}
          </Text>
        </View>
      )}
      {showOnline && contact.online && (
        <View
          style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: '#22C55E',
            borderWidth: 2,
            borderColor: '#fff',
          }}
        />
      )}
    </View>
  );
}

function TypingDots() {
  const [dots, setDots] = useState('•');
  useEffect(() => {
    const iv = setInterval(() => {
      setDots((d) => (d === '•••' ? '•' : d + '•'));
    }, 400);
    return () => clearInterval(iv);
  }, []);
  return <Text style={{ color: '#9CA3AF', fontSize: 18, letterSpacing: 2 }}>{dots}</Text>;
}

// Call Modal Component
function CallModal({ 
  visible, 
  contact, 
  onEndCall, 
  onClose 
}: { 
  visible: boolean; 
  contact: Contact;
  onEndCall: () => void;
  onClose: () => void;
}) {
  const [callDuration, setCallDuration] = useState(0);
  
  useEffect(() => {
    if (visible) {
      setCallDuration(0);
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [visible]);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.callModalOverlay}>
        <View style={styles.callModalContent}>
          <View style={styles.callAvatar}>
            <Avatar contact={contact} size={80} showOnline={false} />
          </View>
          <Text style={styles.callName}>{contact.name}</Text>
          <Text style={styles.callStatus}>Call in progress...</Text>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
          
          <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
            <Ionicons name="call" size={32} color="#fff" />
            <Text style={styles.endCallText}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function ConversationScreen({ contact, onBack }: { contact: Contact; onBack: () => void }) {
  const allConvos = useStore(conversationsStore);
  const messages: ChatMessage[] = allConvos[contact.id] || [];
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages.length, isTyping]);

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, time: getCurrentTime() };
    const current = conversationsStore.get();
    conversationsStore.set({ ...current, [contact.id]: [...(current[contact.id] || []), userMsg] });

    setIsTyping(true);
    const reply = await sendWithTyping(contact.name, [...(current[contact.id] || []), userMsg], text);
    setIsTyping(false);

    const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', text: reply, time: getCurrentTime() };
    const updated = conversationsStore.get();
    conversationsStore.set({
      ...updated,
      [contact.id]: [...(updated[contact.id] || []), assistantMsg],
    });
  }, [inputText, contact]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCallStart = () => {
    setShowCallModal(true);
  };

  const handleCallEnd = () => {
    const now = new Date();
    const record: CallRecord = {
      id: Date.now().toString(),
      contactId: contact.id,
      contactName: contact.name,
      avatarColor: contact.avatarColor,
      avatarText: contact.avatarText,
      avatarImage: contact.avatarImage,
      date: getCurrentDate(),
      time: getCurrentTime(),
      callType: 'outgoing',
    };
    callsStore.set([record, ...callsStore.get()]);
    setShowCallModal(false);
    Alert.alert('Call Ended', `Call with ${contact.name} logged at ${record.time}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#5B4EC0" />
        </TouchableOpacity>
        <Avatar contact={contact} size={40} showOnline />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.chatHeaderName}>{contact.name}</Text>
          <Text style={styles.chatHeaderStatus}>{contact.online ? 'ONLINE' : 'OFFLINE'}</Text>
        </View>
        <TouchableOpacity onPress={handleCallStart} style={styles.headerIconBtn}>
          <Ionicons name="call-outline" size={24} color="#5B4EC0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="videocam-outline" size={24} color="#5B4EC0" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => {
            const isMe = msg.role === 'user';
            const showDateDivider = index === 0 || 
              (messages[index - 1]?.time !== msg.time && index > 0);
            
            return (
              <View key={msg.id}>
                {showDateDivider && (
                  <View style={styles.dateDivider}>
                    <Text style={styles.dateDividerText}>Today</Text>
                  </View>
                )}
                <View style={[
                  styles.bubbleRow,
                  isMe ? styles.bubbleRowMe : styles.bubbleRowThem,
                ]}>
                  {!isMe && (
                    <View style={{ marginRight: 8, alignSelf: 'flex-end' }}>
                      <Avatar contact={contact} size={32} showOnline={false} />
                    </View>
                  )}
                  <View style={{ maxWidth: '75%' }}>
                    <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                      <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                        {msg.text}
                      </Text>
                    </View>
                    <Text style={[styles.bubbleTime, isMe && { textAlign: 'right' }]}>
                      {msg.time}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View style={[styles.bubbleRow, styles.bubbleRowThem]}>
              <View style={{ marginRight: 8, alignSelf: 'flex-end' }}>
                <Avatar contact={contact} size={32} showOnline={false} />
              </View>
              <View style={[styles.bubble, styles.bubbleThem, { paddingVertical: 12 }]}>
                <TypingDots />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputAction}>
            <Ionicons name="attach-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TextInput
            style={styles.chatInput}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={!inputText.trim()}>
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? '#fff' : '#C4B5FD'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Call Modal */}
      <CallModal
        visible={showCallModal}
        contact={contact}
        onEndCall={handleCallEnd}
        onClose={() => setShowCallModal(false)}
      />
    </SafeAreaView>
  );
}

function AddContactModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newContact: Contact = {
      id: Date.now().toString(),
      name: trimmed,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      avatarText: trimmed.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      online: true,
    };
    contactsStore.set([...contactsStore.get(), newContact]);
    conversationsStore.set({ ...conversationsStore.get(), [newContact.id]: [] });
    setName('');
    onClose();
    Alert.alert('Success', `${trimmed} has been added to your contacts`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>New Conversation</Text>
              <Text style={styles.modalSubtitle}>Enter the person's name to start chatting</Text>

              <View style={styles.modalInputWrap}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Full name..."
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleAdd}
                />
              </View>

              <TouchableOpacity
                style={[styles.modalAddBtn, !name.trim() && { opacity: 0.5 }]}
                onPress={handleAdd}
                disabled={!name.trim()}
              >
                <Text style={styles.modalAddBtnText}>Start Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={{ marginTop: 12, alignItems: 'center' }}>
                <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

function ChatListItem({ contact, onPress }: { contact: Contact; onPress: () => void }) {
  const allConvos = useStore(conversationsStore);
  const messages = allConvos[contact.id] || [];
  const lastMsg = messages[messages.length - 1];
  const unreadCount = messages.filter((m) => m.role === 'assistant' && m.id !== messages[messages.length - 1]?.id).length;

  return (
    <TouchableOpacity style={styles.messageItem} onPress={onPress} activeOpacity={0.7}>
      <Avatar contact={contact} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName}>{contact.name}</Text>
          <Text style={styles.messageTime}>{lastMsg?.time || ''}</Text>
        </View>
        <View style={styles.messagePreviewRow}>
          <Text style={styles.messagePreview} numberOfLines={1}>
            {lastMsg ? lastMsg.text : 'Tap to start chatting...'}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ChatsScreen() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [openContact, setOpenContact] = useState<Contact | null>(null);
  const contacts = useStore(contactsStore);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (openContact) {
    return <ConversationScreen contact={openContact} onBack={() => setOpenContact(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.userAvatarSmall}>
          <Text style={styles.userAvatarText}>S</Text>
        </View>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatListItem contact={item} onPress={() => setOpenContact(item)} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="chatbubbles-outline" size={48} color="#D1D5DB" />
            <Text style={{ color: '#9CA3AF', marginTop: 12, fontSize: 15 }}>
              {search ? 'No conversations found' : 'No chats yet. Tap + to start one!'}
            </Text>
          </View>
        }
      />

      <AddContactModal visible={showAdd} onClose={() => setShowAdd(false)} />

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => setShowAdd(true)}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const PURPLE = '#5B4EC0';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userAvatarSmall: { width: 36, height: 36, borderRadius: 18, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  userAvatarText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: PURPLE },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF0F7',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },
  listContent: { paddingBottom: 100 },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  messageContent: { flex: 1 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  messageName: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  messageTime: { fontSize: 12, color: '#9CA3AF' },
  messagePreviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  messagePreview: { flex: 1, fontSize: 13, color: '#6B7280', marginRight: 8 },
  unreadBadge: { backgroundColor: PURPLE, borderRadius: 12, minWidth: 22, height: 22, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 4, marginRight: 4 },
  chatHeaderName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  chatHeaderStatus: { fontSize: 11, color: '#22C55E', fontWeight: '600' },
  headerIconBtn: { padding: 6, marginLeft: 8 },
  messageList: { flex: 1, backgroundColor: '#F5F6FA' },
  dateDivider: { alignItems: 'center', marginBottom: 16, marginTop: 8 },
  dateDividerText: { fontSize: 12, color: '#6B7280', backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  bubbleRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubbleRowThem: { justifyContent: 'flex-start' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '100%' },
  bubbleMe: { backgroundColor: PURPLE, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#fff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextMe: { color: '#fff' },
  bubbleTime: { fontSize: 11, color: '#9CA3AF', marginTop: 4, marginHorizontal: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 8 },
  inputAction: { paddingBottom: 8 },
  chatInput: { flex: 1, minHeight: 40, maxHeight: 120, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 10 : 8, paddingBottom: 8, fontSize: 15, color: '#1A1A2E' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  modalInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', borderRadius: 14, paddingHorizontal: 14, height: 52, marginBottom: 16, borderWidth: 1.5, borderColor: '#EDE9FE' },
  modalInput: { flex: 1, fontSize: 16, color: '#1A1A2E' },
  modalAddBtn: { backgroundColor: PURPLE, borderRadius: 14, height: 52, justifyContent: 'center', alignItems: 'center' },
  modalAddBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 88, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
  callModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  callModalContent: { alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 30, padding: 40, width: '85%' },
  callAvatar: { marginBottom: 20 },
  callName: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 },
  callStatus: { fontSize: 14, color: '#22C55E', marginBottom: 16 },
  callDuration: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 40, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  endCallButton: { backgroundColor: '#EF4444', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 40, gap: 12 },
  endCallText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});