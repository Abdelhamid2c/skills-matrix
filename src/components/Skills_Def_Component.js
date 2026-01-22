import React, { useState } from 'react';
import styled from 'styled-components';
import SKILLS_MATRIX from '../utils/Skills_Def';

const MatrixContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
`;

const CategorySection = styled.div`
  margin-bottom: 30px;
`;

const CategoryTitle = styled.h2`
  background-color: #d4a574;
  color: white;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0;
`;

const SubCategoryTitle = styled.h3`
  background-color: #e8d4c0;
  color: black;
  padding: 8px;
  font-size: 14px;
  font-weight: bold;
  margin: 0;
`;

const SkillItem = styled.div`
  background-color: #f9f9f9;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DevelopmentWarning = styled.div`
  background-color: #fffbeb;
  border-left: 4px solid #fbbf24;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 4px;
  display: flex;
  gap: 12px;

  p {
    font-size: 14px;
    color: #92400e;
    margin: 0;
    font-weight: 500;
  }
`;

const SkillsMatrix = () => {
  return (
    <MatrixContainer>
      <DevelopmentWarning>
        <span>⚠️</span>
        <p>
          <strong>Page under development</strong> - Skills definitions are being
          updated
        </p>
      </DevelopmentWarning>

      <h1>Skills Matrix</h1>
      {Object.entries(SKILLS_MATRIX).map(([category, content]) => (
        <CategorySection key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          {Array.isArray(content) ? (
            // Si c'est un array direct
            content.map((skill, idx) => (
              <SkillItem key={idx}>{skill}</SkillItem>
            ))
          ) : (
            // Si c'est un objet avec sous-catégories
            Object.entries(content).map(([subCategory, skills]) => (
              <div key={subCategory}>
                <SubCategoryTitle>{subCategory}</SubCategoryTitle>
                {Array.isArray(skills) &&
                  skills.map((skill, idx) => (
                    <SkillItem key={idx}>{skill}</SkillItem>
                  ))}
              </div>
            ))
          )}
        </CategorySection>
      ))}
    </MatrixContainer>
  );
};

export default SkillsMatrix;
