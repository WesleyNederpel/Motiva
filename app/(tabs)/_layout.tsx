import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="rewards">
        <Label>Rewards</Label>
        <Icon sf="gift.fill" md="card_giftcard" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="index">
        <Label>Dashboard</Label>
        <Icon sf="list.bullet.clipboard.fill" md="checklist" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.crop.circle.fill" md="account_circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
