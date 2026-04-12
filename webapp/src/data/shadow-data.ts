import type { MbtiTypeData, ShadowSubtype } from '../types'
export { SHADOW_GROUP_OPTIONS, shadowQuestions } from './shadow-questions'
import { INTJ_SHADOW, INTJ_TYPE } from './shadow-nicknames/INTJ'
import { ENTJ_SHADOW, ENTJ_TYPE } from './shadow-nicknames/ENTJ'
import { INTP_SHADOW, INTP_TYPE } from './shadow-nicknames/INTP'
import { ENTP_SHADOW, ENTP_TYPE } from './shadow-nicknames/ENTP'
import { INFJ_SHADOW, INFJ_TYPE } from './shadow-nicknames/INFJ'
import { ENFJ_SHADOW, ENFJ_TYPE } from './shadow-nicknames/ENFJ'
import { INFP_SHADOW, INFP_TYPE } from './shadow-nicknames/INFP'
import { ENFP_SHADOW, ENFP_TYPE } from './shadow-nicknames/ENFP'
import { ISTJ_SHADOW, ISTJ_TYPE } from './shadow-nicknames/ISTJ'
import { ESTJ_SHADOW, ESTJ_TYPE } from './shadow-nicknames/ESTJ'
import { ISFJ_SHADOW, ISFJ_TYPE } from './shadow-nicknames/ISFJ'
import { ESFJ_SHADOW, ESFJ_TYPE } from './shadow-nicknames/ESFJ'
import { ISTP_SHADOW, ISTP_TYPE } from './shadow-nicknames/ISTP'
import { ESTP_SHADOW, ESTP_TYPE } from './shadow-nicknames/ESTP'
import { ISFP_SHADOW, ISFP_TYPE } from './shadow-nicknames/ISFP'
import { ESFP_SHADOW, ESFP_TYPE } from './shadow-nicknames/ESFP'

export const TYPE_SHADOW_NICKNAMES: Record<string, Record<string, ShadowSubtype>> = {
  INTJ: INTJ_SHADOW,
  ENTJ: ENTJ_SHADOW,
  INTP: INTP_SHADOW,
  ENTP: ENTP_SHADOW,
  INFJ: INFJ_SHADOW,
  ENFJ: ENFJ_SHADOW,
  INFP: INFP_SHADOW,
  ENFP: ENFP_SHADOW,
  ISTJ: ISTJ_SHADOW,
  ESTJ: ESTJ_SHADOW,
  ISFJ: ISFJ_SHADOW,
  ESFJ: ESFJ_SHADOW,
  ISTP: ISTP_SHADOW,
  ESTP: ESTP_SHADOW,
  ISFP: ISFP_SHADOW,
  ESFP: ESFP_SHADOW,
}

export const mbtiTypes: Record<string, MbtiTypeData> = {
  INTJ: INTJ_TYPE,
  ENTJ: ENTJ_TYPE,
  INTP: INTP_TYPE,
  ENTP: ENTP_TYPE,
  INFJ: INFJ_TYPE,
  ENFJ: ENFJ_TYPE,
  INFP: INFP_TYPE,
  ENFP: ENFP_TYPE,
  ISTJ: ISTJ_TYPE,
  ESTJ: ESTJ_TYPE,
  ISFJ: ISFJ_TYPE,
  ESFJ: ESFJ_TYPE,
  ISTP: ISTP_TYPE,
  ESTP: ESTP_TYPE,
  ISFP: ISFP_TYPE,
  ESFP: ESFP_TYPE,
}

// ─── 位置名称 ──────────────────────────────────────────────

export const positionNames: Record<number, string> = {
  1: '主导功能（英雄）',
  2: '辅助功能（父母）',
  3: '第三功能（内在小孩）',
  4: '劣势功能（阿尼玛）',
  5: '对立人格',
  6: '批判功能（长老）',
  7: '盲点功能（小丑）',
  8: '魔鬼功能（恶魔）',
}
