import { Mission } from '@/app/[locale]/missions/MissionTimeline';

export async function fetchESA(): Promise<Mission[]> {
  // Dummy data, replace with real API or static data
  return [
    {
      id: 'bepicolombo',
      titleEn: 'BepiColombo',
      titleTr: 'BepiColombo',
      dateEn: 'Oct 20, 2018',
      dateTr: '20 Eki 2018',
      rawDate: new Date('2018-10-20').getTime(),
      status: 'active',
      type: 'robotic',
      descEn: 'ESA-JAXA mission to Mercury.',
      descTr: 'ESA-JAXA Merkür görevi.',
      agency: 'ESA / JAXA',
      destinationEn: 'Mercury',
      destinationTr: 'Merkür',
      patch: null
    }
  ];
}

export async function fetchRoscosmos(): Promise<Mission[]> {
  return [
    {
      id: 'soyuzms10',
      titleEn: 'Soyuz MS-10',
      titleTr: 'Soyuz MS-10',
      dateEn: 'Oct 11, 2018',
      dateTr: '11 Eki 2018',
      rawDate: new Date('2018-10-11').getTime(),
      status: 'completed',
      type: 'crewed',
      descEn: 'ISS crewed launch (aborted, crew safe).',
      descTr: 'ISS insanlı fırlatma (iptal, mürettebat güvende).',
      agency: 'Roscosmos',
      destinationEn: 'ISS',
      destinationTr: 'UUİ',
      patch: null
    }
  ];
}

export async function fetchCNSA(): Promise<Mission[]> {
  return [
    {
      id: 'chang-e4',
      titleEn: 'Chang’e 4',
      titleTr: 'Chang’e 4',
      dateEn: 'Dec 7, 2018',
      dateTr: '7 Ara 2018',
      rawDate: new Date('2018-12-07').getTime(),
      status: 'active',
      type: 'robotic',
      descEn: 'First soft landing on the far side of the Moon.',
      descTr: 'Ay’ın uzak yüzüne ilk yumuşak iniş.',
      agency: 'CNSA',
      destinationEn: 'The Moon',
      destinationTr: 'Ay',
      patch: null
    }
  ];
}

export async function fetchJAXA(): Promise<Mission[]> {
  return [
    {
      id: 'hayabusa2',
      titleEn: 'Hayabusa2',
      titleTr: 'Hayabusa2',
      dateEn: 'Dec 3, 2014',
      dateTr: '3 Ara 2014',
      rawDate: new Date('2014-12-03').getTime(),
      status: 'completed',
      type: 'robotic',
      descEn: 'Asteroid sample-return mission.',
      descTr: 'Asteroit örnek toplama görevi.',
      agency: 'JAXA',
      destinationEn: 'Ryugu',
      destinationTr: 'Ryugu',
      patch: null
    }
  ];
}

export async function fetchISRO(): Promise<Mission[]> {
  return [
    {
      id: 'chandrayaan2',
      titleEn: 'Chandrayaan-2',
      titleTr: 'Chandrayaan-2',
      dateEn: 'Jul 22, 2019',
      dateTr: '22 Tem 2019',
      rawDate: new Date('2019-07-22').getTime(),
      status: 'completed',
      type: 'robotic',
      descEn: 'India’s second lunar exploration mission.',
      descTr: 'Hindistan’ın ikinci Ay keşif görevi.',
      agency: 'ISRO',
      destinationEn: 'The Moon',
      destinationTr: 'Ay',
      patch: null
    }
  ];
}
