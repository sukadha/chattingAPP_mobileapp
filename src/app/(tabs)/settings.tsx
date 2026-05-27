import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  // User profile data
  const [userName, setUserName] = useState('sukku');
  const [userEmail, setUserEmail] = useState('sukku@example.com');
  const [userStatus, setUserStatus] = useState('Online');
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);
  const [tempStatus, setTempStatus] = useState(userStatus);

  // Privacy settings
  const [lastSeen, setLastSeen] = useState('Everyone');
  const [profilePhoto, setProfilePhoto] = useState('Everyone');
  const [status, setStatus] = useState('Everyone');
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [showSecurityCode, setShowSecurityCode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Clear any user data if needed
            // Navigate back to sign-in screen
            router.replace('/');
          }
        }
      ]
    );
  };

  const updateProfile = () => {
    setUserName(tempName);
    setUserEmail(tempEmail);
    setUserStatus(tempStatus);
    setShowProfileModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const updatePrivacy = () => {
    setShowPrivacyModal(false);
    Alert.alert('Success', 'Privacy settings updated!');
  };

  const updateSecurity = () => {
    setShowSecurityModal(false);
    if (twoFactorAuth) {
      Alert.alert('2FA Enabled', 'Two-factor authentication has been enabled.');
    } else {
      Alert.alert('2FA Disabled', 'Two-factor authentication has been disabled.');
    }
  };

  const clearStorage = () => {
    Alert.alert(
      'Clear Storage',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'Cache cleared successfully!')
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, onPress, value, showArrow = true }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#5B4EC0" />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      {showArrow ? (
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      ) : (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#E5E7EB', true: '#5B4EC0' }}
          thumbColor="#fff"
        />
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* User Profile Card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => setShowProfileModal(true)}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>AR</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <View style={styles.profileStatus}>
              <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.profileStatusText}>{userStatus}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>

        {/* ACCOUNT Section */}
        <SectionHeader title="ACCOUNT" />
        <View style={styles.section}>
          <SettingItem icon="person-outline" title="Profile" onPress={() => setShowProfileModal(true)} />
          <SettingItem icon="lock-closed-outline" title="Privacy" onPress={() => setShowPrivacyModal(true)} />
          <SettingItem icon="shield-checkmark-outline" title="Security" onPress={() => setShowSecurityModal(true)} />
        </View>

        {/* APP Section */}
        <SectionHeader title="APP" />
        <View style={styles.section}>
          <SettingItem 
            icon="notifications-outline" 
            title="Notifications" 
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            value={notificationsEnabled}
            showArrow={false}
          />
          <SettingItem icon="database-outline" title="Data & Storage" onPress={() => setShowStorageModal(true)} />
          <SettingItem 
            icon="color-palette-outline" 
            title="Appearance" 
            onPress={() => setShowAppearanceModal(true)} 
          />
        </View>

        {/* SUPPORT Section */}
        <SectionHeader title="SUPPORT" />
        <View style={styles.section}>
          <SettingItem icon="help-circle-outline" title="Help Center" onPress={() => setShowHelpModal(true)} />
          <SettingItem icon="information-circle-outline" title="About" onPress={() => setShowAboutModal(true)} />
        </View>

        {/* LOG OUT Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* Profile Modal */}
      <Modal visible={showProfileModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                placeholder="Full Name"
                value={tempName}
                onChangeText={setTempName}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                value={tempEmail}
                onChangeText={setTempEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Status"
                value={tempStatus}
                onChangeText={setTempStatus}
              />
              <TouchableOpacity style={styles.modalButton} onPress={updateProfile}>
                <Text style={styles.modalButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal visible={showPrivacyModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Settings</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.privacyOption}>
                <Text style={styles.privacyLabel}>Last Seen & Online</Text>
                <View style={styles.privacyButtons}>
                  {['Everyone', 'My Contacts', 'Nobody'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.privacyButton, lastSeen === option && styles.privacyButtonActive]}
                      onPress={() => setLastSeen(option)}
                    >
                      <Text style={[styles.privacyButtonText, lastSeen === option && styles.privacyButtonTextActive]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.privacyOption}>
                <Text style={styles.privacyLabel}>Profile Photo</Text>
                <View style={styles.privacyButtons}>
                  {['Everyone', 'My Contacts', 'Nobody'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.privacyButton, profilePhoto === option && styles.privacyButtonActive]}
                      onPress={() => setProfilePhoto(option)}
                    >
                      <Text style={[styles.privacyButtonText, profilePhoto === option && styles.privacyButtonTextActive]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TouchableOpacity style={styles.modalButton} onPress={updatePrivacy}>
                <Text style={styles.modalButtonText}>Apply Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Security Modal */}
      <Modal visible={showSecurityModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Security Settings</Text>
              <TouchableOpacity onPress={() => setShowSecurityModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>Two-Factor Authentication</Text>
                  <Text style={styles.switchDescription}>Add an extra layer of security</Text>
                </View>
                <Switch
                  value={twoFactorAuth}
                  onValueChange={setTwoFactorAuth}
                  trackColor={{ false: '#E5E7EB', true: '#5B4EC0' }}
                  thumbColor="#fff"
                />
              </View>
              {twoFactorAuth && (
                <TouchableOpacity 
                  style={styles.securityCodeButton}
                  onPress={() => setShowSecurityCode(true)}
                >
                  <Text style={styles.securityCodeText}>Setup 2FA</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.modalButton} onPress={updateSecurity}>
                <Text style={styles.modalButtonText}>Save Security Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Storage Modal */}
      <Modal visible={showStorageModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Data & Storage</Text>
              <TouchableOpacity onPress={() => setShowStorageModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>Auto-download media</Text>
                  <Text style={styles.switchDescription}>Download photos and videos automatically</Text>
                </View>
                <Switch
                  value={autoDownload}
                  onValueChange={setAutoDownload}
                  trackColor={{ false: '#E5E7EB', true: '#5B4EC0' }}
                  thumbColor="#fff"
                />
              </View>
              <TouchableOpacity style={styles.clearButton} onPress={clearStorage}>
                <Text style={styles.clearButtonText}>Clear Cache</Text>
              </TouchableOpacity>
              <Text style={styles.storageInfo}>Cache Size: 24.5 MB</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Appearance Modal */}
      <Modal visible={showAppearanceModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Appearance</Text>
              <TouchableOpacity onPress={() => setShowAppearanceModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>Dark Mode</Text>
                  <Text style={styles.switchDescription}>Switch between light and dark theme</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#E5E7EB', true: '#5B4EC0' }}
                  thumbColor="#fff"
                />
              </View>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowAppearanceModal(false)}>
                <Text style={styles.modalButtonText}>Apply Theme</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Help Center Modal */}
      <Modal visible={showHelpModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help Center</Text>
              <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <TouchableOpacity style={styles.helpItem} onPress={() => {
                setShowHelpModal(false);
                Alert.alert('FAQ', 'Frequently asked questions will appear here.');
              }}>
                <Ionicons name="chatbubble-outline" size={24} color="#5B4EC0" />
                <Text style={styles.helpItemText}>FAQ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpItem} onPress={() => {
                setShowHelpModal(false);
                Alert.alert('Contact Support', 'support@chatapp.com');
              }}>
                <Ionicons name="mail-outline" size={24} color="#5B4EC0" />
                <Text style={styles.helpItemText}>Contact Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpItem} onPress={() => {
                setShowHelpModal(false);
                Alert.alert('User Guide', 'User guide documentation will be available soon.');
              }}>
                <Ionicons name="document-text-outline" size={24} color="#5B4EC0" />
                <Text style={styles.helpItemText}>User Guide</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={showAboutModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.aboutBody}>
              <View style={styles.aboutIcon}>
                <Text style={styles.aboutIconText}>C</Text>
              </View>
              <Text style={styles.aboutAppName}>ChatApp</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              <Text style={styles.aboutDescription}>
                A modern messaging app for seamless communication with your team and friends.
              </Text>
              <Text style={styles.aboutCopyright}>© 2026 ChatApp. All rights reserved.</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B4EC0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  profileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  profileStatusText: {
    fontSize: 13,
    color: '#6B7280',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  modalBody: {
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  modalButton: {
    backgroundColor: '#5B4EC0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyOption: {
    marginBottom: 24,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  privacyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  privacyButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  privacyButtonActive: {
    backgroundColor: '#5B4EC0',
  },
  privacyButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  privacyButtonTextActive: {
    color: '#fff',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  securityCodeButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  securityCodeText: {
    fontSize: 14,
    color: '#5B4EC0',
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  storageInfo: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  helpItemText: {
    fontSize: 16,
    color: '#374151',
  },
  aboutBody: {
    padding: 24,
    alignItems: 'center',
  },
  aboutIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5B4EC0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutIconText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  aboutAppName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  aboutCopyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});