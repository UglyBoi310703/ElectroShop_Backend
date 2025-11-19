package com.example.encodingapp

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val inputText = findViewById<EditText>(R.id.inputText)
        val radioUpper = findViewById<RadioButton>(R.id.radioUpper)
        val radioLower = findViewById<RadioButton>(R.id.radioLower)
        val radioReverse = findViewById<RadioButton>(R.id.radioReverse)
        val btnConvert = findViewById<Button>(R.id.btnConvert)
        val tvResult = findViewById<TextView>(R.id.tvResult)

        btnConvert.setOnClickListener {
            val text = inputText.text.toString()
            if (text.isEmpty()) {
                tvResult.text = "Vui lòng nhập dữ liệu!"
                return@setOnClickListener
            }

            val result = when {
                radioUpper.isChecked -> text.uppercase()
                radioLower.isChecked -> text.lowercase()
                radioReverse.isChecked -> text.reversed()
                else -> "Vui lòng chọn một kiểu mã hóa"
            }

            tvResult.text = "Kết quả: $result"
        }
    }
}
