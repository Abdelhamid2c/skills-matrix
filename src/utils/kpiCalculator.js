/**
 * KPI Calculator - Calcul des indicateurs de performance
 *
 * Ce module calcule les KPIs à partir des réponses du questionnaire
 * et de la fonction de l'utilisateur (pour l'accountability)
 */

/**
 * Tableaux de pondération pour chaque fonction (1 = tâche accountable, 0 = non accountable)
 * Chaque tableau correspond aux 105 compétences dans l'ordre du questionnaire
 */
// const ACCOUNTABILITY_ARRAYS = {
//   'IE Supervisor': [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'IE Responsible': [1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'IE Technician': [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0],
//   'PE Supervisor': [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'PE Responsible': [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'PE Technician': [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0],
//   'PFMEA': [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'SAP & Data Management': [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'Autocad': [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// };
// const ACCOUNTABILITY_ARRAYS = {
//   'IE Supervisor':         [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'IE Responsible':        [1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'IE Technician':         [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0],
//   'PE Supervisor':         [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'PE Responsible':        [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'PE Technician':         [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0],
//   'PFMEA':                 [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'SAP & Data Management': [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'Autocad':               [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   'PP Team Manager' :      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// };
const ACCOUNTABILITY_ARRAYS = {
  'IE Supervisor': [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1],
  'IE Coordinator': [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1],
  'IE Responsible': [1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0,
        0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1],
  'IE Technician': [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
        1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1,
        0],
  'PE Supervisor': [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1,
        0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1],
  'PE Responsible': [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
        1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1],
  'PE Technician': [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
        1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1,
        0],
  'PFMEA': [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'SAP & Data Management': [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1],
  'Autocad': [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'PP Team Manager' :      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};

/**
 * Structure ordonnée des compétences (ordre exact du questionnaire)
 */
const ORDERED_STRUCTURE = {
  "Technical Skills": {
    "Generic": [
      "PP Obeya", "KSK", "Office Tools (Excel, Word…)", "TIGD", "GPMS",
      "Harness XC, CapitalH/M", "APD Tool", "ProdMon", "CAD Software (AutoCad, Catia…)"
    ],
    "PCC & RFQ": [
      "PCC Preparation and Update", "Target Costing Activity",
      "Tooling Capacity and Concept Definition", "Equipment List and Spending Plan preparation",
      "Budget Forecast Preparation and Monitoring", "Ramp-Up Cost Evaluation and Follow-Up"
    ],
    "Product & Process Assurance": [
      "SAP & data management", "Prototype data management", "Spare Parts data management",
      "PM creation", "Key Product Caracteristics", "Drawing Analysis (Complexity & synergy)",
      "Eng Change Management", "ECM (ECR Feasibility)", "ECM (ECR cost Evaluation)",
      "ECR Follow-Up and Implementation", "Wire tuning Activity", "Tube unification Activity",
      "BOM Verification", "Matching Data Preparation", "DFM Execution", "DIS Execution",
      "Similar component analysis", "Handling Manual analysis", "NTI Management"
    ],
    "Process Design": {
      "Manufacturing Process Design": [
        "Capacity Study", "Process design KPIs calculation", "WPO design", "REFA basics",
        "Plausibility", "CPC gum claims creation", "Kakotora / Must item list",
        "Production module time affectation", "IE ECR Tracking", "IE ECR Evaluation & 4M impact",
        "Subassembly decision matrix", "coiling method definition", "Process \"Line\" Concept",
        "Process flow chart", "Sub-assemblies Definition", "Work Subdivision",
        "Splice Decision Matrix", "Definition of off-line processes", "Operators Skills Matrix",
        "Theoretical Time Evaluation SWT", "Fluctuation Definition and Analysis",
        "Missing Operations definition", "Equipment List Definition",
        "Density and Interferance analysis", "Work Area Map definition",
        "Work Instruction", "Operation Normes", "TIGD Exception List"
      ],
      "Technical Process Design": [
        "Theoretical Ergonomics assessment", "Practical Ergonomics assessment",
        "Assembly Jig Board Design Evaluation", "Connection Tools definition",
        "Assembly jig parts/forks review", "Equipment/tool specification & confirmation"
      ],
      "Manufacturing Process Capability": [
        "Time Measurement", "Videos shooting", "Videos Analysis",
        "Balancing Scenarios and Plan", "Work Combination Table",
        "Work Balance Chart Preparation", "YAMAZUMI Chart Preparation",
        "Run Activities Execution", "Off line Equipment Stress tests",
        "Ramp-Up Per station and Line Ramp-Up"
      ]
    },
    "MPSO & RFMEA": [
      "Product FMEA Execution", "RFMEA by workstation Execution",
      "Advanced MPSO Execution", "Official MPSO Execution"
    ]
  },
  "Soft Skills": [
    "Emotional intelligence", "Problem-solving", "Adaptability", "Conflict resolution"
  ],
  "Management Skills": [
    "Project planning & execution", "Process Design KPI monitoring",
    "Budgeting & resource allocation", "Risk management",
    "Strategic thinking", "Team leadership & delegation"
  ],
  "Behavioral Traits": [
    "Accountability", "Initiative", "Reliability", "Collaboration",
    "Self Satisfaction", "Motivation", "Pride to be part of PP", "Growth mindset"
  ],
  "Communication Skills": [
    "Presentations Preparation", "Presentations Delivery",
    "English Language Speaking", "English Language Writing",
    "Outcomes and Meeting Minutes"
  ]
};

/**
 * Indices des catégories dans le tableau de réponses
 */
const CATEGORY_INDICES = {
  technicalSkills: { start: 0, end: 81 },      // 82 compétences techniques
  softSkills: { start: 82, end: 85 },          // 4 soft skills
  managementSkills: { start: 86, end: 91 },    // 6 management skills
  behavioralTraits: { start: 92, end: 99 },    // 8 behavioral traits
  communicationSkills: { start: 100, end: 104 } // 5 communication skills
};

/**
 * Transformer les données normalisées (dictionnaire) en array ordonné
 * @param {Object} normalizedData - Dictionnaire des réponses
 * @returns {Array} - Tableau des réponses dans l'ordre
 */
const transformToArray = (normalizedData) => {
  const responses = [];

  const extractScores = (structure, data, path = []) => {
    if (Array.isArray(structure)) {
      // C'est un tableau de compétences
      structure.forEach(skillName => {
        let current = data;
        for (const key of path) {
          current = current?.[key];
        }
        const score = current?.[skillName];
        responses.push(score !== undefined && score !== null ? score : -1);
      });
    } else if (typeof structure === 'object') {
      // C'est un objet avec des sous-catégories
      Object.entries(structure).forEach(([key, value]) => {
        extractScores(value, data, [...path, key]);
      });
    }
  };

  // Parcourir la structure ordonnée
  Object.entries(ORDERED_STRUCTURE).forEach(([categoryName, categoryData]) => {
    if (Array.isArray(categoryData)) {
      // Catégorie simple (Soft Skills, Management Skills, etc.)
      categoryData.forEach(skillName => {
        const score = normalizedData?.[categoryName]?.[skillName];
        responses.push(score !== undefined && score !== null ? score : -1);
      });
    } else {
      // Catégorie avec sous-catégories (Technical Skills)
      extractScores(categoryData, normalizedData, [categoryName]);
    }
  });

  return responses;
};

/**
 * Obtenir la valeur maximale selon l'index de la compétence
 * @param {number} index - Index de la compétence
 * @returns {number} - Valeur maximale (4 ou 10)
 */
const getMaxValueForIndex = (index) => {
  // Behavioral Traits (indices 92-99) ont une échelle de 0 à 10
  if (index >= CATEGORY_INDICES.behavioralTraits.start && index <= CATEGORY_INDICES.behavioralTraits.end) {
    return 10;
  }
  // Toutes les autres catégories ont une échelle de 0 à 4
  return 4;
};

/**
 * Calculer les KPIs à partir des données et de l'utilisateur
 * @param {Object} currentUser - Utilisateur actuel avec sa fonction
 * @param {Object} normalizedData - Dictionnaire des réponses normalisées
 * @returns {Object} - Objet contenant tous les KPIs calculés
 */
export const calculateKPIs = (currentUser, normalizedData) => {
  // Transformer les données en array
  const allResponses = transformToArray(normalizedData);

  // Obtenir le tableau d'accountability selon la fonction
  const userFunction = currentUser?.fonction || currentUser?.function || '';
  const accountabilityArray = ACCOUNTABILITY_ARRAYS[userFunction] || new Array(105).fill(1);

  console.log('📊 Calcul des KPIs');
  console.log('👤 Fonction utilisateur:', userFunction);
  console.log('📏 Nombre de réponses:', allResponses.length);
  console.log('📋 Réponses:', allResponses);

  // 1. Technical Capability Ratio (indices 0 à 81)
  let technicalSum = 0, technicalMaxSum = 0;
  for (let i = CATEGORY_INDICES.technicalSkills.start; i <= CATEGORY_INDICES.technicalSkills.end && i < allResponses.length; i++) {
    const response = allResponses[i];
    const accountability = accountabilityArray[i] || 0;
    if (response !== -1 && response !== null && response !== undefined) {
      technicalSum += response * accountability;
      technicalMaxSum += accountability * 4;
    } else {
      technicalMaxSum += accountability * 4;
    }
  }
  const technicalCapabilityRatioOverallPP = technicalMaxSum > 0
    ? Math.round((technicalSum / technicalMaxSum) * 100)
    : 0;

  // 2. Soft Skills Ratio (indices 82 à 85)
  let softSkillsSum = 0, softSkillsMaxSum = 0;
  for (let i = CATEGORY_INDICES.softSkills.start; i <= CATEGORY_INDICES.softSkills.end && i < allResponses.length; i++) {
    const response = allResponses[i];
    const accountability = accountabilityArray[i] || 0;
    if (response !== -1 && response !== null && response !== undefined) {
      softSkillsSum += response * accountability;
      softSkillsMaxSum += accountability * 4;
    } else {
      softSkillsMaxSum += accountability * 4;
    }
  }
  const softSkillsRatio = softSkillsMaxSum > 0
    ? Math.round((softSkillsSum / softSkillsMaxSum) * 100)
    : 0;

  // 3. Management Skills Ratio (indices 86 à 91)
  let managementSkillsSum = 0, managementSkillsMaxSum = 0;
  for (let i = CATEGORY_INDICES.managementSkills.start; i <= CATEGORY_INDICES.managementSkills.end && i < allResponses.length; i++) {
    const response = allResponses[i];
    const accountability = accountabilityArray[i] || 0;
    if (response !== -1 && response !== null && response !== undefined) {
      managementSkillsSum += response * accountability;
      managementSkillsMaxSum += accountability * 4;
    } else {
      managementSkillsMaxSum += accountability * 4;
    }
  }
  const managementSkillsRatio = managementSkillsMaxSum > 0
    ? Math.round((managementSkillsSum / managementSkillsMaxSum) * 100)
    : 0;

  // 4. Behavioral Traits Ratio (indices 92 à 99) - Échelle 0-10
  let behavioralTraitsSum = 0, behavioralTraitsMaxSum = 0;
  for (let i = CATEGORY_INDICES.behavioralTraits.start; i <= CATEGORY_INDICES.behavioralTraits.end && i < allResponses.length; i++) {
    const response = allResponses[i];
    const accountability = accountabilityArray[i] || 0;
    if (response !== -1 && response !== null && response !== undefined) {
      behavioralTraitsSum += response * accountability;
      behavioralTraitsMaxSum += accountability * 10;
    } else {
      behavioralTraitsMaxSum += accountability * 10;
    }
  }
  const behavioralTraitsRatio = behavioralTraitsMaxSum > 0
    ? Math.round((behavioralTraitsSum / behavioralTraitsMaxSum) * 100)
    : 0;

  // 5. Communication Skills Ratio (indices 100 à 104)
  let communicationSkillsSum = 0, communicationSkillsMaxSum = 0;
  for (let i = CATEGORY_INDICES.communicationSkills.start; i <= CATEGORY_INDICES.communicationSkills.end && i < allResponses.length; i++) {
    const response = allResponses[i];
    const accountability = accountabilityArray[i] || 0;
    if (response !== -1 && response !== null && response !== undefined) {
      communicationSkillsSum += response * accountability;
      communicationSkillsMaxSum += accountability * 4;
    } else {
      communicationSkillsMaxSum += accountability * 4;
    }
  }
  const communicationSkillsRatio = communicationSkillsMaxSum > 0
    ? Math.round((communicationSkillsSum / communicationSkillsMaxSum) * 100)
    : 0;

  // 6. Capability Ratio Accountable Tasks (toutes les 105 compétences avec accountability)
  let accountableSum = 0, accountableMaxSum = 0;
  for (let i = 0; i < allResponses.length; i++) {
    const response = allResponses[i];
    const accountability = accountabilityArray[i] || 0;
    const maxValue = getMaxValueForIndex(i);
    if (response !== -1 && response !== null && response !== undefined) {
      accountableSum += response * accountability;
      accountableMaxSum += accountability * maxValue;
    } else {
      accountableMaxSum += accountability * maxValue;
    }
  }
  const capabilityRatioAccountableTasks = accountableMaxSum > 0
    ? Math.round((accountableSum / accountableMaxSum) * 100)
    : 0;

  // 7. Capability Ratio Overall PP (sans accountability - toutes compétences)
  let totalSum = 0, totalMaxSum = 0;
  for (let i = 0; i < allResponses.length; i++) {
    const response = allResponses[i];
    const maxValue = getMaxValueForIndex(i);
    if (response !== -1 && response !== null && response !== undefined) {
      totalSum += response;
      totalMaxSum += maxValue;
    } else {
      totalMaxSum += maxValue;
    }
  }
  const capabilityRatioOverallPP = totalMaxSum > 0
    ? Math.round((totalSum / totalMaxSum) * 100)
    : 0;

  const kpis = {
    capabilityRatioOverallPP,
    capabilityRatioAccountableTasks,
    technicalCapabilityRatioOverallPP,
    softSkillsRatio,
    managementSkillsRatio,
    behavioralTraitsRatio,
    communicationSkillsRatio
  };

  console.log('✅ KPIs calculés:', kpis);

  return kpis;
};

/**
 * Obtenir le tableau d'accountability pour une fonction donnée
 * @param {string} userFunction - Fonction de l'utilisateur
 * @returns {Array} - Tableau d'accountability
 */
export const getAccountabilityArray = (userFunction) => {
  return ACCOUNTABILITY_ARRAYS[userFunction] || new Array(105).fill(1);
};

/**
 * Obtenir la liste des fonctions disponibles
 * @returns {Array} - Liste des noms de fonctions
 */
export const getAvailableFunctions = () => {
  return Object.keys(ACCOUNTABILITY_ARRAYS);
};

/**
 * Transformer et obtenir les réponses en array
 * @param {Object} normalizedData - Données normalisées
 * @returns {Array} - Tableau des réponses
 */
export const getResponsesArray = (normalizedData) => {
  return transformToArray(normalizedData);
};

export default {
  calculateKPIs,
  getAccountabilityArray,
  getAvailableFunctions,
  getResponsesArray
};
