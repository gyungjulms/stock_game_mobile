import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getSocket } from '../api/socket';

export default function ParticipantScreen() {
  const [gameId, setGameId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [participantId, setParticipantId] = useState<string>("");
  const [assets, setAssets] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<Record<string, string>>({});
  const [portfolio, setPortfolio] = useState<any | null>(null);

  const createGame = () => {
    const s = getSocket();
    s.emit('game:create', {}, (res: any) => {
      if (res?.ok) {
        setGameId(res.game.gameId);
        setAssets(res.game.assets);
      }
    });
  };

  const register = () => {
    if (!gameId || !name) return;
    const s = getSocket();
    s.emit('participant:register', gameId, name, (res: any) => {
      if (res?.ok) setParticipantId(res.participant.participantId);
    });
  };

  const allocate = () => {
    if (!gameId || !participantId) return;
    const payload = Object.entries(allocations)
      .filter(([_, v]) => v)
      .map(([assetId, amt]) => ({ assetId, amount: Number(amt) }));
    const s = getSocket();
    s.emit('portfolio:allocate', gameId, participantId, payload, (res: any) => {
      if (res?.ok) setPortfolio(res.participant);
    });
  };

  const loadPortfolio = () => {
    // 소켓 프로토콜에는 별도 조회가 없어, 최근 업데이트된 로컬 상태를 유지합니다.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>참가자 화면</Text>
      <Button title="게임 생성" onPress={createGame} />
      <Text>gameId: {gameId}</Text>

      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="이름" value={name} onChangeText={setName} />
        <Button title="등록" onPress={register} />
      </View>
      <Text>participantId: {participantId}</Text>

      <Text style={styles.subtitle}>자본 배분</Text>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.asset}>{item.name}</Text>
            <TextInput
              style={styles.input}
              placeholder="금액"
              keyboardType="numeric"
              value={allocations[item.id] || ''}
              onChangeText={(t) => setAllocations((prev) => ({ ...prev, [item.id]: t }))}
            />
          </View>
        )}
      />
      <Button title="배분 적용" onPress={allocate} />
      <Button title="포트폴리오 새로고침" onPress={loadPortfolio} />

      {portfolio && (
        <View style={styles.card}>
          <Text>현금: {Math.round(portfolio.cash)}</Text>
          <Text>순자산가치: {Math.round(portfolio.netWorth)}</Text>
          <Text>포지션:</Text>
          {portfolio.positions?.map((p: any) => (
            <Text key={p.assetId}>- {p.assetId}: {Math.round(p.marketValue ?? p.quantity)}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  asset: { width: 100 },
  card: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginTop: 12 }
});


